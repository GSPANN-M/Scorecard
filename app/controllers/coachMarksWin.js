var args = arguments[0] || {},
    app = require("core");

didOrientationChangeCoachMark();

function didOpen(e) {
	Ti.App.addEventListener("orientationChange", didOrientationChangeCoachMark);
}

function didClose(e) {
	Ti.App.removeEventListener("orientationChange", didOrientationChangeCoachMark);
}

function didOrientationChangeCoachMark(e) {
	$.img.image = "/images/coach_marks_".concat(app.device.orientation).concat(".png");
	console.log($.img.image);
}

function didClick(e) {
	$.coachMarksWin.close();
}
