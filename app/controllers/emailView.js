var args = arguments[0] || {},
    animation = require("alloy/animation"),
    http = require("http"),
    db = require("db"),
    http = require("http"),
    dialog = require("dialog"),
    isBusy = false;

function didClickSubmit(e) {
	if (isBusy) {
		return;
	}
	var value = $.txt.value,
	    regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (regexp.test(value) == false) {
		dialog.show({
			message : "Please enter a valid email id."
		});
		return;
	}
	isBusy = true;
	$.loadingLbl.visible = true;
	http.request({
		url : "http://vcclamresearch.com:88/SurveyService.svc/validate/".concat(value),
		format : "JSON",
		success : function(result) {
			if (result.Result == "Success") {
				storeEmail(value);
			} else {
				isBusy = false;
				$.loadingLbl.visible = false;
				dialog.show({
					message : result.Message
				});
			}
		},
		failure : function() {
			isBusy = false;
			$.loadingLbl.visible = false;
			dialog.show({
				message : "Something went wrong, please check your internet connectivity."
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
	close();
}

function init(parent) {
	parent.add($.emailView);
	animation.fadeIn($.emailView, 500);
}

function close() {
	animation.fadeAndRemove($.emailView, 500, $.emailView.getParent());
}

exports.init = init;
