import '@logseq/libs';


logseq.ready(() => {
	// logseq.App.showMsg("Hello World Logseq!");
	logseq.UI.showMsg("Hello World Logseq!");
}).catch(console.error);

console.log(logseq.Editor);
