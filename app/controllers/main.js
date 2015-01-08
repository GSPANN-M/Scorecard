var args = arguments[0] || {},
    app = require("core"),
    animation = require("alloy/animation"),
    scule = require("com.scule"),
    dialog = require("dialog"),
    tileFromTop = 15,
    scrollViews = {
	columnOne : {
		position : 0,
		items : ["industry_leadership", "innovative_products", "timely_solutions", "partnering_for_mutual_benefit", "tool_upgrades"]
	},
	columnTwo : {
		position : 0,
		items : ["equipment_performance", "tool_quality", "spares_performance", "service_contracts", "technical_support"]
	},
	columnThree : {
		position : 0,
		items : ["meeting_commitments", "ease_of_doing_business", "fast_response_to_escalations", "tool_installation", "on_time_delivery"]
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
		var items = scrollViews[i].items,
		    lastIndex = items.length - 1;
		for (var j in items) {
			$[items[j]] = $.UI.create("View", {
				apiName : "View",
				classes : j == lastIndex ? ["tile-from-top", "tile-from-bottom", "width-100", "auto-height"] : ["tile-from-top", "width-100", "auto-height"],
				id : "#".concat(items[j])
			});
			var imageView = $.UI.create("ImageView", {
				apiName : "ImageView",
				classes : ["touch-disabled", "fill-width", "auto-height"]
			}),
			    circleView = Ti.UI.createView({
				width : circleWidth,
				height : circleWidth,
				borderRadius : circleWidth / 2,
				backgroundColor : "#90FFFFFF",
				touchEnabled : false
			}),
			    label = $.UI.create("Label", {
				apiName : "Label",
				classes : ["touch-disabled", "width-90", "text-center", "h2", "fg-naviblue"]
			});
			label.text = items[j].replace(/_/g, " ").toUpperCase();
			imageView.image = "/images/".concat(items[j]).concat(".png");
			circleView.add(label);
			$[items[j]].add(imageView);
			$[items[j]].add(circleView);
			$[items[j]].formId = items[j];
			$[items[j]].tileText = label.text;
			$[items[j]].imagePath = imageView.image;
			$[items[j]].addEventListener("click", didClickTile);
			$[i].add($[items[j]]);
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
	var emailColl = scule.factoryCollection(Alloy.CFG.collection.email, {
		secret : Alloy.CFG.secret
	});
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
	if ($.modalView.visible == false) {
		$.modalView.formId = e.source.formId;
		$.modalImg.image = e.source.imagePath;
		$.modalLbl.text = e.source.tileText;
		$.optionView.rating = "none";
		$.thumbUp.backgroundColor = "#2F2F2F";
		$.thumbDown.backgroundColor = "#2F2F2F";
		$.txta.setValue("");
		toggleModal();
	}
}

function didClickOption(e) {
	var source = e.source;
	if ($.thumbUp == source) {
		$.thumbDown.backgroundColor = "#2F2F2F";
		$.thumbUp.backgroundColor = "#D66360";
		$.optionView.rating = "1";
	} else {
		$.thumbUp.backgroundColor = "#2F2F2F";
		$.thumbDown.backgroundColor = "#D66360";
		$.optionView.rating = "0";
	}
}

function didClickOK(e) {
	if ($.optionView.rating == "none") {
		dialog.show({
			message : "Feeback can't be empty"
		});
		return;
	}
	closeModal();
}

function closeModal(e) {
	toggleModal();
}

function didCancelSurvey(e) {
	dialog.show({
		title : "Are you sure?",
		message : "The existing survey will be deleted.",
		buttonNames : ["Cancel", "OK"],
		cancelIndex : 0,
		success : function() {
			var emailColl = scule.factoryCollection(Alloy.CFG.collection.email, {
				secret : Alloy.CFG.secret
			});
			emailColl.remove({});
			emailColl.commit();
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