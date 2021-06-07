const vscode = require('vscode');
const pkgs = require('./lib/getPackages');
const picker = require('./lib/picker');
const goGet = require('./lib/doGoGetCheck');
// Dev
const insert = require('./lib/Insert.js');

async function showInputBox() {
	const result = await vscode.window.showInputBox({
		value: '',
		placeHolder: 'Search...',
	});
	return `${result}`;
}

function activate(context) {

	let disposable = vscode.commands.registerCommand('pkggo.search', () => {
		showInputBox().then(
			async value => {
				let packages = await pkgs.get(value);
				let picked = await picker.show(packages);
				devInsert.test(picked);
				goGet.show(picked);
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
