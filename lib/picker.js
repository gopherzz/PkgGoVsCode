const vscode = require('vscode');

async function show(founded_pkgs) {
	let pkgs = [];
	for (let i = 0; i < founded_pkgs.names.length; i++) {
		let item = {
			label: founded_pkgs.names[i],
			description: founded_pkgs.descs[i]
		};
		pkgs.push(item);
	}

	const result = await vscode.window.showQuickPick(pkgs, {
		placeHolder: 'Package..."undefined"'
	});
	return `${result.label}`;
}

module.exports = {
    show
}