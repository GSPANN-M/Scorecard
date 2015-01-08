var args = arguments[0] || {},
    db = require("db"),
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
	var emailColl = db.getCollection(Alloy.CFG.collection.email);
	emailColl.save({
		email : value
	});
	db.commit(emailColl);
	$.emailWin.close();
}
