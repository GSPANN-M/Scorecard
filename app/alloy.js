/**
 * Global function to open a window within the navigation window.
 * @param {Objec} win - Window object
 * @return None
 */
Alloy.Globals.openWindow = function(win) {
	if (OS_IOS) {
		Alloy.Globals.navWin.openWindow(win);
	} else {
		win.open({
			activityEnterAnimation : Ti.Android.R.anim.slide_in_left,
			activityExitAnimation : Ti.Android.R.anim.slide_out_right
		});
	}
};

/**
 * Global function to close a window within the navigation window.
 * @param {Objec} win - Window object
 * @return None
 */
Alloy.Globals.closeWindow = function(win) {
	if (OS_IOS) {
		Alloy.Globals.navWin.closeWindow(win);
	} else {
		win.close({
			activityEnterAnimation : Ti.Android.R.anim.slide_out_right,
			activityExitAnimation : Ti.Android.R.anim.slide_in_left
		});
	}
};
