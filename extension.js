const vscode = require('vscode');
const pkgs = require('./lib/getPackages');
const picker = require('./lib/picker');
const insert = require('./lib/importsInsert');
const goGet = require('./lib/doGoGetCheck');

async function showInputBox() {
	const result = await vscode.window.showInputBox({
		value: '',
		placeHolder: 'Search...',
	});
	return `${result}`;
}

function activate(context) {

	let disposable = vscode.commands.registerCommand('pkggo.search', () => {
		// const isGoFile = vscode.workspace.workspaceFile.path.endsWith('.go');
		// if (!isGoFile) {
		// 	vscode.window.showWarningMessage("No go file!")
		// }
		showInputBox().then(
			async value => {
				let packages = await pkgs.get(value);
				let picked = await picker.show(packages);
				insert.pkg(picked);
				// if (isGoFile) {
				goGet.show(picked);
				// }
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
