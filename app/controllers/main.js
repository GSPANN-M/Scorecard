var args = arguments[0] || {},
    app = require("core"),
    animation = require("alloy/animation"),
    dialog = require("dialog"),
    db = require("db"),
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
    tileLHeight;

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
			$[item.card_id].position = {
				column : columnIndex,
				row : j
			};
			$[item.card_id].addEventListener("click", didClickTile);
			$[i].add($[item.card_id]);
		}
	}
})();

function didOpen() {
	Ti.App.addEventListener("orientationChange", didOrientationChange);
	if (Ti.App.Properties.getBool("firstLaunch", false) === false) {
		Ti.App.Properties.setBool("firstLaunch", true);
		var coachMarksWin = Alloy.createController("coachMarksWin").getView();
		coachMarksWin.addEventListener("open", checkForEmail);
		coachMarksWin.open();
	} else {
		checkForEmail();
	}
	updateFilledTiles();
}

function checkForEmail(e) {
	var email = getEmail();
	if (!email) {
		Alloy.createController("emailWin").getView().open();
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
			$.thumbUp.backgroundColor = feedbackRecord.feedback == "1" ? "#D66360" : "#2F2F2F";
			$.thumbDown.backgroundColor = feedbackRecord.feedback == "0" ? "#D66360" : "#2F2F2F";
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
		$.thumbDown.backgroundColor = "#2F2F2F";
		$.thumbUp.backgroundColor = "#D66360";
		$.optionView.feedback = "1";
	} else {
		$.thumbUp.backgroundColor = "#2F2F2F";
		$.thumbDown.backgroundColor = "#D66360";
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
		$[feedbackRecord.card_id].children[3].image = "/images/" + (feedbackRecord.feedback == "0" ? "thumb_down" : "thumb_up") + ".png";
	} else {
		feedbackColl.save(feedbackRecord);
		updateFilledTiles($.modalView.card_id);
	}
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
				classes : ["bg-red", "close-view"]
			}),
			    closeIcon = Ti.UI.createImageView({
				width : 20,
				height : 20,
				image : "/images/close.png",
				touchEnabled : false
			}),
			    thumbIcon = Ti.UI.createImageView({
				bottom : 15,
				width : 40,
				height : 40,
				image : "/images/" + (cards[i].feedback == "0" ? "thumb_down" : "thumb_up") + ".png"
			});
			closeView.addEventListener("click", didRemoveFeedback);
			closeView.add(closeIcon);
			selectedCard.children[1].backgroundColor = "#D66360";
			selectedCard.children[1].children[0].color = "#FFFFFF";
			selectedCard.add(closeView);
			selectedCard.add(thumbIcon);
		}
	}
}

function closeModal(e) {
	toggleModal();
}

function didRemoveFeedback(e) {
	var cardId = e.source.getParent().card_id;
	dialog.show({
		title : "Are you sure?",
		message : "This feedback will be deleted.",
		buttonNames : ["Cancel", "OK"],
		cancelIndex : 0,
		success : function() {
			updateCardWithNoFeedback(cardId);
		}
	});
}

function updateCardWithNoFeedback(cardId) {
	feedbackColl.remove({
		card_id : cardId
	});
	db.commit(feedbackColl);
	var selectedCard = $[cardId],
	    children = selectedCard.children;
	selectedCard.children[1].backgroundColor = "#90FFFFFF";
	selectedCard.children[1].children[0].color = "#160C4C";
	selectedCard.remove(children[2]);
	selectedCard.remove(children[3]);
}

function didCancelSurvey(e) {
	dialog.show({
		title : "Are you sure?",
		message : "The existing survey will be deleted.",
		buttonNames : ["Cancel", "OK"],
		cancelIndex : 0,
		success : function() {
			var emailColl = db.getCollection(Alloy.CFG.collection.email);
			emailColl.clear();
			db.commit(emailColl);
			var cards = feedbackColl.findAll();
			for (var i in cards) {
				updateCardWithNoFeedback(cards[i].card_id);
			}
			feedbackColl.clear();
			db.commit(feedbackColl);
			checkForEmail();
		}
	});
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