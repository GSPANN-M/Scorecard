var args = arguments[0] || {};

function didBack(e) {
	$.submissionWin.didBack = true;
	Alloy.Globals.closeWindow($.submissionWin);
}
