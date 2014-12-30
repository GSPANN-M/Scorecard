var args = arguments[0] || {},
    animation = require('alloy/animation'),
    app = require("core"),
    scrollPoint = {
	columnOne : 0,
	columnTwo : 0,
	columnThree : 0
},
    modalDict;

function didOpen() {
	app.init();
}

function didClose() {
	app.terminate();
}

function didHideModal(e) {
	if ($.modalView.visible == true) {
		Ti.App.removeEventListener("orientationChange", didOrientationChange);

		//animation.fadeIn($.modalImg, 150, function() {
		var anim = Ti.UI.createAnimation(_.extend(modalDict, {
			duration : 300
		}));
		anim.addEventListener("complete", function onComplte() {
			anim.removeEventListener("complete", onComplte);
			$.modalView.applyProperties(_.extend(_.omit(modalDict, "duration"), {
				width : modalDict - 1,
				visible : false
			}));
		});
		$.modalView.animate(anim);
		//});
	} else if (OS_ANDROID) {
		$.main.close();
	}
}

function didOrientationChange(e) {
	var device = app.getDeviceDimensions();
	$.modalView.applyProperties({
		width : device.width,
		height : device.height - Alloy.CFG.navBarHeight
	});
}

function didScroll(e) {
	scrollPoint[e.source.identifier] = OS_IOS ? e.y : e.y / app.device.logicalDensityFactor;
}

function didClickTile(e) {

	var view = e.source,
	    parent = view.getParent(),
	    size = view.size,
	    action = view.action,
	    index = view.index,
	    cIndex = index.column - 1,
	    rIndex = index.row - 1,
	    containerWidth = app.device.width - ((app.device.width / 100) * 4),
	    containerFromLeft = (app.device.width / 100) * 2,
	    top = rIndex * size.height,
	    left = cIndex * size.width,
	    device = app.getDeviceDimensions();

	left += containerFromLeft + (((containerWidth / 100) * 2) * cIndex);
	top += (rIndex * 5);

	top -= scrollPoint[parent.identifier];

	modalDict = {
		top : top,
		left : left,
		width : size.width,
		height : size.height,
		visible : true
	};
	$.modalImg.image = view.children[0].image;

	var callback = function() {

		$.modalView.removeEventListener("postlayout", callback);

		var dict = {
			top : 0,
			left : 0,
			width : device.width,
			height : device.height - Alloy.CFG.navBarHeight,
			duration : 300
		},
		    anim = Ti.UI.createAnimation(dict);
		anim.addEventListener("complete", function onComplteWH() {
			anim.removeEventListener("complete", onComplteWH);
			$.modalView.applyProperties(_.omit(dict, "duration"));
			//animation.fadeOut($.modalImg, 150);
		});
		$.modalView.animate(anim);

		Ti.App.addEventListener("orientationChange", didOrientationChange);

		console.log("chosen : ", action);
		switch(action) {
		case "industry_leadership":
			break;
		case "innovative_products":
			break;
		case "timely_solutions":
			break;
		case "partnering_for_mutual_benefit":
			break;
		case "tool_upgrades":
			break;
		case "equipment_performance":
			break;
		case "tool_quality":
			break;
		case "spares_performance":
			break;
		case "service_contracts":
			break;
		case "technical_support":
			break;
		case "meeting_commitments":
			break;
		case "ease_of_doing_business":
			break;
		case "fast_response_to_escalations":
			break;
		case "tool_installation":
			break;
		case "on_time_delivery":
			break;
		}
	};
	$.modalView.addEventListener("postlayout", callback);
	$.modalView.applyProperties(modalDict);
}