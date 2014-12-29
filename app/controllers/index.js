if (OS_IOS) {
	Alloy.Globals.navWin = $.index;
	Alloy.Globals.navWin.open();
} else {
	$.index.getView().open();
}