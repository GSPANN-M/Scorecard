var args = arguments[0] || {},
    scule = require("com.scule"),
    dialog = require("dialog");

function didClickSubmit(e) {
	var value = $.txt.value,
	    regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (regexp.test(value) == false) {
		dialog.show({
			message : "Please enter a valid email id"
		});
		return;
	}
	Ti.App.Properties.setString("email", value);
	var emailColl = scule.factoryCollection(Alloy.CFG.collection.email, {
		secret : Alloy.CFG.secret
	});
	emailColl.save({
		email : value
	});
	emailColl.commit();
	$.emailWin.close();
}
