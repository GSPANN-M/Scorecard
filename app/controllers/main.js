var args = arguments[0] || {},
    animation = require('alloy/animation'),
    app = require("core"),
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
	if (Ti.App.Properties.getBool("firstLaunch", false) === false) {
		Ti.App.Properties.setBool("firstLaunch", true);
		Alloy.createController("coachMarks").getView().open();
	}
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
				backgroundColor : "#90FFFFFF"
			}),
			    label = $.UI.create("Label", {
				apiName : "Label",
				classes : ["touch-disabled", "width-90", "text-center", "h2", "fg-naviblue"]
			});
			label.text = items[j].replace(/_/g, " ").toUpperCase();
			imageView.image = "/images/".concat(items[j]).concat(".png");
			circleView.formId = items[j];
			circleView.add(label);
			circleView.addEventListener("click", didClickTile);
			$[items[j]].add(imageView);
			$[items[j]].add(circleView);
			$[i].add($[items[j]]);
		}
	}
	$.modalContent.top = Alloy.CFG.navBarHeight + tileHeight + tileFromTop;
	$.modalTileView = Ti.UI.createView({
		top : Alloy.CFG.navBarHeight + tileFromTop,
		width : tileWidth,
		height : tileHeight,
		opacity : 0,
		visible : false
	});
	$.modalImg = $.UI.create("ImageView", {
		apiName : "ImageView",
		classes : ["touch-disabled", "fill-width", "auto-height"]
	});
	$.modalCircle = Ti.UI.createView({
		width : circleWidth,
		height : circleWidth,
		borderRadius : circleWidth / 2,
		backgroundColor : "#90FFFFFF"
	});
	$.modalLbl = $.UI.create("Label", {
		apiName : "Label",
		classes : ["touch-disabled", "width-90", "text-center", "h2", "fg-naviblue"]
	});
	$.modalCircle.add($.modalLbl);
	$.modalTileView.add($.modalImg);
	$.modalTileView.add($.modalCircle);
	$.main.add($.modalTileView);
})();

function didOpen() {
	Ti.App.addEventListener("orientationChange", didOrientationChange);
	if (Ti.App.Properties.getString("email", "") == "") {
		Alloy.createController("email").getView().open();
	}
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
		$.optionView.rating = "none";
		$.thumbUp.backgroundColor = "#2F2F2F";
		$.thumbDown.backgroundColor = "#2F2F2F";
		$.txta.setValue("");
		$.modalContent.top = Number(Alloy.CFG.navBarHeight) + Number(tileHeight) + (tileFromTop * 2);
		$.modalTileView.applyProperties({
			top : Alloy.CFG.navBarHeight + tileFromTop,
			width : tileWidth,
			height : tileHeight,
			visible : true
		});
		$.modalImg.image = e.source.getParent().children[0].image;
		$.modalLbl.text = e.source.children[0].text;
		toggleModal(function() {
			animation.fadeIn($.modalTileView, 500, function() {
				$.modalTileView.opacity = 1;
			});
		});
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
	animation.fadeOut($.modalTileView, 500, function() {
		$.modalTileView.applyProperties({
			opacity : 0,
			visible : false
		});
		toggleModal();
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