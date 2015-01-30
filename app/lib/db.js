var db = {
	scule : require("com.scule"),
	encryptionUtil : require("encryptionUtil"),
	getCollection : function(storage) {
		var data = (db.scule.factoryCollection("scule+titanium://".concat(storage)).findAll()[0] || {}).data || "",
		    coll = db.scule.factoryCollection("scule+dummy://".concat(storage));
		data = data != "" ? JSON.parse(db.encryptionUtil.decrypt(data)) : [];
		for (var i in data) {
			coll.save(data[i]);
		}
		return coll;
	},
	commit : function(tcoll) {
		var data = db.encryptionUtil.encrypt(JSON.stringify(tcoll.findAll())),
		    coll = db.scule.factoryCollection("scule+titanium://".concat(tcoll.name));
		if (coll.getLength()) {
			coll.update({}, {
				$set : {
					data : data
				}
			});
		} else {
			coll.save({
				data : data
			});
		}
		coll.commit();
		return coll;
	}
};

module.exports = db;
