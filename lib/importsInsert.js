const vscode = require('vscode');

// TODO: Add import if import is initialized now
function pkg(pkg) {
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

module.exports = {
    pkg
}