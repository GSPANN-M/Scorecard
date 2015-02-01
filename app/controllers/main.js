var args = arguments[0] || {},
    http = require("http"),
    app = require("core"),
    animation = require("alloy/animation"),
    dialog = require("dialog"),
    db = require("db"),
    lastUrl = "",
    feedbackColl = db.getCollection(Alloy.CFG.collection.feedback),
    scrollViews = {
	columnOne : {
		position : 0,
		items : [{
			card_id : "indstr_ldrshp",
			image : "/images/industry_leadership.png",
			title : "INDUSTRY LEADERSHIP"
		}, {
			card_id : "innvt_prdts",
			image : "/images/innovative_products.png",
			title : "INNOVATIVE PRODUCTS"
		}, {
			card_id : "timly_soltns",
			image : "/images/timely_solutions.png",
			title : "TIMELY SOLUTIONS"
		}, {
			card_id : "prtnrng_for_mutul_bnft",
			image : "/images/partnering_for_mutual_benefit.png",
			title : "PARTNERING FOR MUTUAL BENEFIT"
		}, {
			card_id : "tool_upgrd",
			image : "/images/tool_upgrades.png",
			title : "TOOL UPGRADES"
		}]
	},
	columnTwo : {
		position : 0,
		items : [{
			card_id : "equpmnt_prfrmnc",
			image : "/images/equipment_performance.png",
			title : "EQUIPMENT PERFORMANCE"
		}, {
			card_id : "tool_qlty",
			image : "/images/tool_quality.png",
			title : "TOOL QUALITY"
		}, {
			card_id : "sprs_prfrmnc",
			image : "/images/spares_performance.png",
			title : "SPARES PERFORMANCE"
		}, {
			card_id : "srvc_cntrct",
			image : "/images/service_contracts.png",
			title : "SERVICE CONTRACTS"
		}, {
			card_id : "tech_supprt",
			image : "/images/technical_support.png",
			title : "TECHNICAL SUPPORT"
		}]
	},
	columnThree : {
		position : 0,
		items : [{
			card_id : "mtng_cmtmnts",
			image : "/images/meeting_commitments.png",
			title : "MEETING COMMITMENTS"
		}, {
			card_id : "ease_of_doing_biz",
			image : "/images/ease_of_doing_business.png",
			title : "EASE OF DOING BUSINESS"
		}, {
			card_id : "fst_rspns_to_escltn",
			image : "/images/fast_response_to_escalations.png",
			title : "FAST RESPONSE TO ESCALATIONS"
		}, {
			card_id : "tool_instl",
			image : "/images/tool_installation.png",
			title : "TOOL INSTALLATION"
		}, {
			card_id : "on_time_dlvry",
			image : "/images/on_time_delivery.png",
			title : "ON TIME DELIVERY"
		}]
	}
},
    tilePWidth,
    tilePHeight,
    tileLWidth,
    tileLHeight,
    submissionWin;

(function() {
	app.init();
	var circleWidth = getDimensions().circleWidth;
	for (var i in scrollViews) {
		var columnIndex = scrollViews[i].position,
		    items = scrollViews[i].items,
		    lastIndex = items.length - 1;
		for (var j in items) {
			var item = items[j];
			$[item.card_id] = $.UI.create("View", {
				apiName : "View",
				classes : j == lastIndex ? ["tile-from-top", "tile-from-bottom", "width-100", "auto-height"] : ["tile-from-top", "width-100", "auto-height"]
			});
			var imageView = $.UI.create("ImageView", {
				apiName : "ImageView",
				classes : ["tile-img", "touch-disabled", "fill-width", "auto-height", "zindex-0"]
			}),
			    circleView = Ti.UI.createView({
				width : circleWidth,
				height : circleWidth,
				borderRadius : circleWidth / 2,
				backgroundColor : "#90FFFFFF",
				touchEnabled : false,
				zIndex : 2
			}),
			    label = $.UI.create("Label", {
				apiName : "Label",
				classes : ["touch-disabled", "width-90", "text-center", "h2", "fg-naviblue"]
			});
			label.text = item.title;
			imageView.image = item.image;
			circleView.add(label);
			$[item.card_id].add(imageView);
			$[item.card_id].add(circleView);
			$[item.card_id].card_id = item.card_id;
			$[item.card_id].tileText = item.title;
			$[item.card_id].imagePath = item.image;
			$[item.card_id].selectedImagePath = item.image.replace(".png", "_grey.png");
			$[item.card_id].position = {
				column : columnIndex,
				row : j
			};
			$[item.card_id].addEventListener("click", didClickTile);
			$[i].add($[item.card_id]);
		}
	}
	Alloy.Globals.submissionTileWidth = ((app.device.orientation == "landscape" ? app.device.height : app.device.width) - 200 ) / 4;
	Alloy.Globals.submissionCircleWidth = Alloy.Globals.submissionTileWidth - 36;
	Alloy.Globals.submissionCircleRadius = Alloy.Globals.submissionCircleWidth / 2;
})();

function didOpen() {
	Ti.App.addEventListener("orientationChange", didOrientationChange);
	if (Ti.App.Properties.getBool("firstLaunch", false) === false) {
		Ti.App.Properties.setBool("firstLaunch", true);
		var coachMarksWin = Alloy.createController("coachMarksWin").getView();
		coachMarksWin.addEventListener("close", checkForEmail);
		coachMarksWin.open();
	} else {
		if (OS_IOS) {
			Ti.App.addEventListener("resumed", didResume);
		} else {
			$.main.activity.addEventListener("newintent", didResume);
		}
		checkUrl();
	}
}

function didResume(e) {
	if ($.main.children.length > 5) {
		animation.fadeAndRemove($.main.children[5], 500, $.main);
	}
	if (submissionWin) {
		submissionWin.didBack = true;
		Alloy.Globals.closeWindow(submissionWin);
	}
	if ($.modalView.opacity != 0) {
		animation.fadeOut($.modalView, 500, function() {
			$.modalView.applyProperties({
				opacity : 0,
				visible : false
			});
		});
	}
	checkUrl();
}

function checkUrl() {
	var url = "",
	    email,
	    regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (OS_IOS) {
		url = Ti.App.getArguments().url;
	} else {
		url = Ti.Android.currentActivity.intent.data;
	}
	if (url == lastUrl) {
		url = "";
	} else {
		lastUrl = url;
	}
	email = getParams(url || "").email || "";
	if (email != "" && regexp.test(email) == true) {
		$.loadingView.visible = true;
		animation.fadeIn($.loadingView, 500, function() {
			$.loadingView.applyProperties({
				opacity : 1
			});
		});
		http.request({
			url : "http://vcclamresearch.com:88/SurveyService.svc/validate/".concat(email),
			format : "JSON",
			success : function(result) {

				var emailColl = db.getCollection(Alloy.CFG.collection.email);
				emailColl.clear();

				var cards = feedbackColl.findAll();
				for (var i in cards) {
					updateCardWithNoFeedback(cards[i].card_id, false);
				}
				feedbackColl.clear();
				db.commit(feedbackColl);

				if (result.Result == "Success") {
					emailColl.save({
						email : email
					});
				} else {
					dialog.show({
						message : result.Message
					});
				}

				db.commit(emailColl);
				initApp();
			},
			failure : function() {
				dialog.show({
					message : "Something went wrong, please check your internet connectivity."
				});
				initApp();
			}
		});
	} else {
		initApp();
	}
}

function initApp() {
	animation.fadeOut($.loadingView, 500, function(e) {
		$.loadingView.applyProperties({
			opacity : 1,
			visible : false
		});
	});
	if (checkForEmail()) {
		if (feedbackColl.getLength()) {
			updateFilledTiles();
		}
	}
	updateFlotingBar();
}

function getParams(url) {
	var query = url.substring(url.indexOf("?") + 1),
	    vars = query.split("&"),
	    params = {};
	if (!vars.length) {
		vars = [query];
	}
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		params[pair[0]] = pair[1];
	}
	return params;
}

function checkForEmail(e) {
	var email = getEmail();
	if (!email) {
		Alloy.createController("emailView").init($.main);
		return false;
	}
	return email;
}

function getEmail() {
	var emailColl = db.getCollection(Alloy.CFG.collection.email);
	return (emailColl.find({}, {
	$limit : 1
	})[0] || {}).email;
}

function didClose() {
	app.terminate();
}

function toggleModal(callback) {
	if ($.modalView.visible == true) {
		animation.fadeOut($.modalView, 500, function() {
			$.modalView.applyProperties({
				opacity : 0,
				visible : false
			});
			if (callback) {
				callback();
			}
		});
	} else {
		$.modalView.visible = true;
		animation.fadeIn($.modalView, 500, function() {
			$.modalView.opacity = 1;
			if (callback) {
				callback();
			}
		});
	}
}

function didOrientationChange(e) {
	getDimensions();
}

function getDimensions(e) {
	var device = app.getDeviceDimensions(),
	    containerWidth;
	tileWidth = Number(Ti.App.Properties.getString(app.device.orientation.concat("TileWidth"), 0));
	tileHeight = Number(Ti.App.Properties.getString(app.device.orientation.concat("TileHeight"), 0));
	if (tileWidth == 0 || tileHeight == 0) {
		containerWidth = (device.width / 100) * 96;
		tileWidth = Math.floor((containerWidth / 100) * 32);
		var blob = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "/images/industry_leadership.png").read();
		tileHeight = Math.floor((blob.height / blob.width) * tileWidth);
		Ti.App.Properties.setString(app.device.orientation.concat("TileWidth"), tileWidth);
		Ti.App.Properties.setString(app.device.orientation.concat("TileHeight"), tileHeight);
	}
	if (app.device.orientation == "landscape") {
		containerWidth = (device.height / 100) * 96;
		return {
			circleWidth : Math.floor(((containerWidth / 100) * 32 / 100) * 80)
		};
	} else {
		return {
			circleWidth : Math.floor((tileWidth / 100) * 80)
		};
	}
}

function didScroll(e) {
	scrollViews[e.source.identifier]["position"] = OS_IOS ? e.y : e.y / app.device.logicalDensityFactor;
}

function didClickTile(e) {
	var tileView = e.source;
	if (tileView.card_id) {
		var feedbackRecord = feedbackColl.find({
		card_id : tileView.card_id
		})[0] || {};
		if (feedbackColl.getLength() < 4 || !_.isEmpty(feedbackRecord)) {
			$.modalView.card_id = tileView.card_id;
			$.modalImg.image = tileView.imagePath;
			$.modalLbl.text = tileView.tileText;
			$.optionView.feedback = feedbackRecord.feedback || "none";
			$.thumbUpImg.image = feedbackRecord.feedback == "1" ? "/images/thumb_up_red.png" : "/images/thumb_up_grey.png";
			$.thumbDownImg.image = feedbackRecord.feedback == "0" ? "/images/thumb_down_red.png" : "/images/thumb_down_grey.png";
			$.txta.setValue(feedbackRecord.comments || "");
			toggleModal();
		} else {
			dialog.show({
				message : "You can't rate about more than 4 areas."
			});
		}
	}
}

function didClickOption(e) {
	var source = e.source;
	if ($.thumbUp == source) {
		$.thumbUpImg.image = "/images/thumb_up_red.png";
		$.thumbDownImg.image = "/images/thumb_down_grey.png";
		$.optionView.feedback = "1";
	} else {
		$.thumbDownImg.image = "/images/thumb_down_red.png";
		$.thumbUpImg.image = "/images/thumb_up_grey.png";
		$.optionView.feedback = "0";
	}
}

function didClickOK(e) {
	if ($.optionView.feedback == "none") {
		dialog.show({
			message : "Feeback can't be empty."
		});
		return;
	}
	var cards = feedbackColl.find({
		card_id : {
			$ne : $.modalView.card_id
		}
	}),
	    positiveCount = 0,
	    nagativeCount = 0;
	for (var i in cards) {
		cards[i].feedback == "1" ? positiveCount++ : nagativeCount++;
	}
	$.optionView.feedback == "1" ? positiveCount++ : nagativeCount++;
	if (positiveCount > 2 || nagativeCount > 2) {
		dialog.show({
			message : "At max, you can rate about only 4 areas, 2 positive and 2 nagative."
		});
		return;
	}
	var feedbackRecord = feedbackColl.find({
	card_id : $.modalView.card_id
	})[0] || {};
	_.extend(feedbackRecord, {
		card_id : $.modalView.card_id,
		feedback : $.optionView.feedback,
		comments : $.txta.getValue()
	});
	if (_.has(feedbackRecord, "_id")) {
		feedbackColl.update({
			card_id : $.modalView.card_id
		}, {
			$set : _.omit(feedbackRecord, ["_id"])
		});
		$[feedbackRecord.card_id].children[1].children[1].image = "/images/" + (feedbackRecord.feedback == "0" ? "sad_white" : "smile_white") + ".png";
	} else {
		feedbackColl.save(feedbackRecord);
		updateFilledTiles($.modalView.card_id);
	}
	updateFlotingBar();
	db.commit(feedbackColl);
	closeModal();
}

function updateFilledTiles(cardId) {
	var cards = cardId ? feedbackColl.find({
		card_id : cardId
	}) : feedbackColl.findAll();
	for (var i in cards) {
		var cardId = cards[i].card_id,
		    selectedCard = $[cardId];
		if (selectedCard && selectedCard.children.length == 2) {
			var closeView = $.UI.create("View", {
				apiName : "View",
				classes : ["close-view"]
			}),
			    closeIcon = Ti.UI.createImageView({
				image : "/images/wrong_enabled.png",
				touchEnabled : false
			}),
			    faceImg = Ti.UI.createImageView({
				top : 10,
				width : 30,
				image : "/images/" + (cards[i].feedback == "0" ? "sad_white" : "smile_white") + ".png"
			});
			closeView.addEventListener("click", didRemoveFeedback);
			closeView.add(closeIcon);
			selectedCard.children[1].add(faceImg);
			selectedCard.children[1].children[0].color = "#D66360";
			selectedCard.children[0].image = selectedCard.selectedImagePath;
			selectedCard.add(closeView);
		}
	}
}

function closeModal(e) {
	$.txta.blur();
	toggleModal();
}

function didRemoveFeedback(e) {
	var cardId = e.source.getParent().card_id;
	updateCardWithNoFeedback(cardId);
	/*dialog.show({
	 title : "Are you sure?",
	 message : "This feedback will be deleted.",
	 buttonNames : ["Cancel", "OK"],
	 cancelIndex : 0,
	 success : function() {
	 updateCardWithNoFeedback(cardId);
	 }
	 });*/
}

function updateCardWithNoFeedback(cardId, doUpdateFlotingBar) {
	feedbackColl.remove({
		card_id : cardId
	});
	db.commit(feedbackColl);
	var selectedCard = $[cardId],
	    children = selectedCard.children;
	if (children.length > 1) {
		selectedCard.children[1].children[0].color = "#160C4C";
		selectedCard.children[1].remove(selectedCard.children[1].children[1]);
		selectedCard.children[0].image = selectedCard.imagePath;
		selectedCard.remove(children[2]);
		if (doUpdateFlotingBar !== false) {
			updateFlotingBar();
		}
	}
}

function didCancelSurvey(e) {
	dialog.show({
		title : "Are you sure?",
		message : "The existing survey will be deleted.",
		buttonNames : ["Cancel", "OK"],
		cancelIndex : 0,
		success : clearSurvey
	});
}

function clearSurvey() {
	var emailColl = db.getCollection(Alloy.CFG.collection.email);
	emailColl.clear();
	db.commit(emailColl);
	var cards = feedbackColl.findAll();
	for (var i in cards) {
		updateCardWithNoFeedback(cards[i].card_id, false);
	}
	feedbackColl.clear();
	db.commit(feedbackColl);
	updateFlotingBar();
	lastUrl = "";
	checkForEmail();
}

function updateFlotingBar() {
	var pCards = feedbackColl.find({
		feedback : "1"
	}),
	    nCards = feedbackColl.find({
		feedback : "0"
	});
	for (var i = 0; i < 2; i++) {
		var card = pCards[i] || {},
		    image = "/images/thumb_up_" + (_.isEmpty(card) ? "grey" : "red").concat(".png");
		$["thumbPositive".concat(i)].image = image;
	}
	for (var i = 0; i < 2; i++) {
		var card = nCards[i] || {},
		    image = "/images/thumb_down_" + (_.isEmpty(card) ? "grey" : "red").concat(".png");
		$["thumbNegative".concat(i)].image = image;
	}
	if (pCards.length || nCards.length) {
		$.submitIcon.image = "/images/right_enabled.png";
	} else {
		$.submitIcon.image = "/images/right_disabled.png";
	}
}

function didClickSubmit(e) {
	if ($.submitIcon.image == "/images/right_enabled.png") {
		submissionWin = Alloy.createController("submissionWin").getView();
		submissionWin.addEventListener("close", function() {
			if (!submissionWin.didBack) {
				clearSurvey();
			}
			submissionWin = false;
		});
		Alloy.Globals.openWindow(submissionWin);
	}
}

function didClickThumbView(e) {
	if (feedbackColl.getLength() != 0) {
		var ctrl = Alloy.createController("readyForSubmit"),
		    view = ctrl.getView();
		ctrl.on("removeFeedback", function(e) {
			if (feedbackColl.getLength() == 1) {
				animation.fadeAndRemove(view, 500, $.main);
			}
			updateCardWithNoFeedback(e.card_id);
		});
		/*ctrl.getView("okBtn").addEventListener("click", function() {
		 if ($.submitIcon.image == "/images/right_enabled.png") {
		 submissionWin = Alloy.createController("submissionWin").getView();
		 submissionWin.addEventListener("open", function() {
		 animation.fadeAndRemove(view, 500, $.main);
		 });
		 submissionWin.addEventListener("close", function() {
		 if (!submissionWin.didBack) {
		 clearSurvey();
		 }
		 submissionWin = false;
		 });
		 Alloy.Globals.openWindow(submissionWin);
		 } else {
		 animation.fadeAndRemove(view, 500, $.main);
		 }
		 });*/
		$.main.add(view);
		animation.fadeIn(view, 500);
	}
}

function didClose(e) {
	Ti.App.removeEventListener("orientationChange", didOrientationChange);
}

function didAndroidback(e) {
	if ($.modalView.visible == true) {
		closeModal();
	} else {
		$.main.close();
	}
}