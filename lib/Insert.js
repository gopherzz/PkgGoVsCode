const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;

function getImportLine(text, importInserted) {
    let lines = text.split('\n');
    if ((lines[2] == "" || lines[2] == "\r") && !importInserted) {
        console.log(lines);
        return {line: 3, column: 0}
    }
    for (let i = 0; i < 10; i++) {
        if (lines[i].startsWith('import')) {
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j] == '(') {
                    console.log(lines[i][j]);
                    return {line: i, column: j+1, isFirst: lines[i][j+1]==')' ? true : false};
                }
            }
            break;
        }
    }
    return {line: 3, column: 0}
}

function insertPackage(builder, pos, picked) {
    if (pos.column == 0) {
        builder.insert(new vscode.Position(pos.line, pos.column), `import (\n\t"${picked}"${pos.isFirst ? '\n' : ''})`);    
        return;
    }
    builder.insert(new vscode.Position(pos.line, pos.column), `\n\t"${picked}"${pos.isFirst ? '\n' : ''}`);
}

async function test(picked) {
    let document = editor.document;
    let line = getImportLine(document.getText());
    if (line.column == 0) {
        line.isFirst = true;
    }
    editor.edit(builder => {
        insertPackage(builder, line, picked);
    })
    
    console.log(line);
}

module.exports = {
    test
}