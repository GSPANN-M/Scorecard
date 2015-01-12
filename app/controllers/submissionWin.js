var args = arguments[0] || {},
    http = require("http"),
    dialog = require("dialog"),
    db = require("db"),
    feedbackColl = db.getCollection(Alloy.CFG.collection.feedback),
    items = [{
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
}, {
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
}, {
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
}],
    isBusy = false;

(function() {
	var cards = feedbackColl.find({}, {
		$sort : {
			feedback : -1
		}
	}),
	    lastIndex = cards.length - 1;
	for (var i in cards) {
		var item = _.findWhere(items, {
			card_id : cards[i].card_id
		});
		$[item.card_id] = $.UI.create("View", {
			apiName : "View",
			classes : i == lastIndex ? ["tile-view", "auto-height"] : ["margin-right", "tile-view", "auto-height"]
		});
		var imageView = $.UI.create("ImageView", {
			apiName : "ImageView",
			classes : ["touch-disabled", "fill-width", "auto-height"]
		}),
		    circleView = $.UI.create("View", {
			apiName : "View",
			classes : ["circle-view"]
		}),
		    label = $.UI.create("Label", {
			apiName : "Label",
			classes : ["touch-disabled", "width-90", "text-center", "h3", "fg-naviblue"]
		}),
		    faceImg = Ti.UI.createImageView({
			top : 10,
			width : 20,
			image : "/images/" + (cards[i].feedback == "0" ? "sad_white" : "smile_white") + ".png"
		});
		label.text = item.title;
		imageView.image = item.image;
		circleView.add(label);
		circleView.add(faceImg);
		$[item.card_id].add(imageView);
		$[item.card_id].add(circleView);
		$.tileContainer.add($[item.card_id]);
	}
})();

function didBack(e) {
	if (isBusy) {
		return;
	}
	$.submissionWin.didBack = true;
	Alloy.Globals.closeWindow($.submissionWin);
}

function didClickOption(e) {
	if (isBusy) {
		return;
	}
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

function didClickSubmit(e) {
	if (isBusy) {
		return;
	}
	if ($.optionView.feedback == "none") {
		dialog.show({
			message : "Feeback can't be empty."
		});
		return;
	}
	isBusy = true;
	$.loadingLbl.visible = true;
	var feedbacks = feedbackColl.findAll(),
	    tempFeedbacks = [];
	_.map(feedbacks, function(obj) {
		tempFeedbacks.push(_.omit(obj, ["_id"]));
	});
	var requestObj = {
		cust_eml_id : db.getCollection(Alloy.CFG.collection.email).findAll()[0].email,
		feedback : tempFeedbacks,
		other_feedback : $.txta.getValue(),
		recommend_LAM : $.optionView.feedback
	};
	http.request({
		url : "http://vcclamresearch.com:88/SurveyService.svc/submitSurvey",
		type : "POST",
		format : "JSON",
		data : requestObj,
		success : function(result) {
			dialog.show({
				message : result.Message,
				buttonNames : ["OK"],
				cancelIndex : 0,
				cancel : function() {
					if (result.Result == "Success") {
						$.submissionWin.close();
					}
				}
			});
		},
		failure : function() {
			dialog.show({
				message : "Something went wrong, please check your internet connectivity."
			});
		},
		done : function() {
			isBusy = false;
			$.loadingLbl.visible = false;
		}
	});
}