const vscode = require('vscode');
const rp = require('request-promise');
const cheerio = require("cheerio");

const url = "https://pkg.go.dev/search?q=";

async function showInputBox() {
	const result = await vscode.window.showInputBox({
		value: '',
		placeHolder: 'Search',
	});
	return `${result}`;
}

// TODO: Add import if import is initialized now
function insertImport(pkg) {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		if (editor.selection.isEmpty) {
			var position = editor.selection.active;
			editor.edit(editBuilder => {
				editBuilder.insert(position, `"${pkg}"`);
			});
		}
	}
}
async function pickPackage(names, descs) {
	let pkgs = [];
	for (let i = 0; i < names.length; i++) {
		let item = {
			label: names[i],
			description: descs[i]
		};
		pkgs.push(item);
	}

	const result = await vscode.window.showQuickPick(pkgs, {
		placeHolder: 'Package..."undefined"'
	});
	insertImport(`${result}`);
}

async function getNames(q){
	var resNames = [];
	await rp(q)
		.then(html => {
			const $ = cheerio.load(html);
			for (let i = 0; i < 10; i++) {
				let name = $('.LegacySearchSnippet > .LegacySearchSnippet-header > a', html)[i].attribs.href.substring(1);
				resNames.push(name);
			}
		});
    return resNames;
}

async function getDescriptions(q) {
	var resDescriptions = [];
	await rp(q)
		.then(html => {
			const $ = cheerio.load(html);
			for (let i = 0; i < 10; i++) {
				let child = $('.LegacySearchSnippet > .SearchSnippet-synopsis', html)[i].childNodes[0];
				if (child.data != undefined) {
					resDescriptions.push(child.data)
					continue;
				}
				resDescriptions.push("");
			}
		})
		.catch(err => console.error(err));
    return resDescriptions;
}

async function getPackagesWithDescription(query) {
	let q = url + query;
	let names = await getNames(q) 
	let descs = await getDescriptions(q)
	pickPackage(names, descs)
}

function activate(context) {

	let disposable = vscode.commands.registerCommand('pkggo.search', () => {
		showInputBox().then(
			value => {
				getPackagesWithDescription(value);				
			}
		);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	// eslint-disable-next-line no-undef
	deactivate
}
