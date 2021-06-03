const vscode = require('vscode');
const pkgs = require('./lib/getPackages');
const picker = require('./lib/picker');
const insert = require('./lib/importsInsert');

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
			value => {
				let packages = pkgs.get(value);
				let picked = picker.show(packages);
				insert.pkg(picked);
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
