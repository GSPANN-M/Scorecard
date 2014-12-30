var args = arguments[0] || {},
    app = require("core");

function didOpen() {
	app.init();
}

function didClose() {
	app.terminate();
}

function didHideModal(e) {
	var animation = animation = Ti.UI.createAnimation({
		width : 1,
		height : 1,
		duration : 300
	});
	animation.addEventListener("complete", function onComplte() {
		animation.removeEventListener("complete", onComplte);
		$.modalView.applyProperties({
			width : 1,
			height : 1
		});
	});
	$.modalView.animate(animation);
	Ti.App.removeEventListener("orientationChange", didOrientationChange);
}

function didOrientationChange(e) {
	var device = app.getDeviceDimensions();
	$.modalView.applyProperties({
		width : device.width,
		height : device.height - Alloy.CFG.navBarHeight
	});
}

function didClickTile(e) {
	var action = e.source.action,
	    device = app.getDeviceDimensions(),
	    animation;
	animation = Ti.UI.createAnimation({
		width : device.width,
		height : device.height - Alloy.CFG.navBarHeight,
		duration : 300
	});
	animation.addEventListener("complete", function onComplte() {
		animation.removeEventListener("complete", onComplte);
		$.modalView.applyProperties({
			width : device.width,
			height : device.height - Alloy.CFG.navBarHeight
		});
	});
	$.modalView.animate(animation);
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