var args = arguments[0] || {},
    http = require("http"),
    db = require("db"),
    http = require("http"),
    dialog = require("dialog"),
    isBusy = false;

function didClickSubmit(e) {
	if (isBusy) {
		return;
	}
	isBusy = true;
	var value = $.txt.value,
	    regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (regexp.test(value) == false) {
		dialog.show({
			message : "Please enter a valid email id."
		});
		return;
	}
	$.loadingLbl.visible = true;
	http.request({
		url : "http://vcclamresearch.com:88/SurveyService.svc/validate/".concat(value),
		success : function(result) {
			storeEmail(value);
		},
		failure : function() {
			isBusy = false;
			dialog.show({
				message : "You seem to be offline, please check your internet connection"
			});
		}
	});
}

function storeEmail(value) {
	var emailColl = db.getCollection(Alloy.CFG.collection.email);
	emailColl.save({
		email : value
	});
	db.commit(emailColl);
	$.emailWin.close();
}
