const vscode = require('vscode');

async function show(pkgName) {
    let variants = [
        {
            label: "Yes",
        },
        {
            label: "No",
        }
    ];

	const result = await vscode.window.showQuickPick(variants, {
		placeHolder: `Do go get ${pkgName}?`
	});
    if (result.label == 'Yes') {
        doGoGet(pkgName)
    }
}

const TASK_SOURCE = 'Go'
// TODO: Test This Code with internet
function doGoGet(pkgName) {
    let command = `go get ${pkgName}`;
    const task = new vscode.Task({ type: 'shell' }, vscode.workspace.workspaceFolders[0], "goget", TASK_SOURCE, new vscode.ShellExecution(command));
    vscode.tasks.executeTask(task)
}

module.exports = {
    show,
    doGoGet
}