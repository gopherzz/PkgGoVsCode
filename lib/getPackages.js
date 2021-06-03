const rp = require('request-promise');
const cheerio = require("cheerio");
const vscode = require('vscode');

const url = "https://pkg.go.dev/search?q=";

async function getNames(q){
	var resNames = [];
	await rp(q)
		.then(html => {
			const $ = cheerio.load(html);
			for (let i = 0; i < 10; i++) {
				let name = $('.LegacySearchSnippet > .LegacySearchSnippet-header > a', html)[i].attribs.href.substring(1);
				resNames.push(name);
			}
		})
        // eslint-disable-next-line no-unused-vars
        .catch(_err =>{
            vscode.window.showErrorMessage(`Error: NetworkError`);
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
		// eslint-disable-next-line no-unused-vars
		.catch(_err => {
            vscode.window.showErrorMessage(`Error: NetworkError`);
        });
    return resDescriptions;
}

async function get(query) {
	let q = url + query;
	let names = await getNames(q) 
	let descs = await getDescriptions(q)
    let packages = {
        names: names,
        descs: descs
    }
	return packages
}

module.exports = {
    get
}