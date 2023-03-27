const fs = require('fs');
const R = require('ramda');


const content = fs.readFileSync('./changelog.md').toString();
let lines = content.split('\n');

let numTagsSeen = 0;
lines = R.takeWhile(
	(line) => {
		if (line.startsWith('## ')) {
			numTagsSeen += 1;
		}
		if (numTagsSeen >= 2) {
			return false;
		}
		return true;
	},
	lines
);

const releaseNotes = lines.join('\n').trim();
fs.writeFileSync('release-note.md', releaseNotes);
