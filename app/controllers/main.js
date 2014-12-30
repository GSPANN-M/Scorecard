var args = arguments[0] || {},
    app = require("core"),
    center;

function didOpen() {
	app.init();
}

function didClose() {
	app.terminate();
}

function didHideModal(e) {

	Ti.App.removeEventListener("orientationChange", didOrientationChange);

	var dict = {
		top : OS_IOS ? center.y : center.y / app.device.logicalDensityFactor,
		left : OS_IOS ? center.x : center.x / app.device.logicalDensityFactor,
		width : 1,
		height : 1,
		duration : 500
	},
	    anim = Ti.UI.createAnimation(dict);
	anim.addEventListener("complete", function onComplte() {
		anim.removeEventListener("complete", onComplte);
		$.modalView.applyProperties(_.extend(_.omit(dict, "duration"), {
			visible : false
		}));
	});
	$.modalView.animate(anim);
}

function didOrientationChange(e) {
	var device = app.getDeviceDimensions();
	$.modalView.applyProperties({
		width : device.width,
		height : device.height - Alloy.CFG.navBarHeight
	});
}

function didClickTile(e) {

	var view = e.source,
	    action = view.action,
	    device = app.getDeviceDimensions();

	$.modalView.visible = true;

	center = view.convertPointToView({
		x : e.x,
		y : e.y
	}, $.template);
	$.modalView.applyProperties({
		top : OS_IOS ? center.y : center.y / app.device.logicalDensityFactor,
		left : OS_IOS ? center.x : center.x / app.device.logicalDensityFactor
	});

	var dict = {
		width : device.width,
		height : device.height - Alloy.CFG.navBarHeight,
		duration : 300
	},
	    animWH = Ti.UI.createAnimation(dict);
	animWH.addEventListener("complete", function onComplteWH() {

		animWH.removeEventListener("complete", onComplteWH);
		$.modalView.applyProperties(_.omit(dict, "duration"));

		var dictTL = {
			top : 0,
			left : 0,
			duration : 200
		},
		    animTL = Ti.UI.createAnimation(dictTL);
		animTL.addEventListener("complete", function onComplteTL() {
			animTL.removeEventListener("complete", onComplteTL);
			$.modalView.applyProperties(_.omit(dictTL, "duration"));
		});
		$.modalView.animate(animTL);

	});
	$.modalView.animate(animWH);

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
}