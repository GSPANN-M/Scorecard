;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("crypto/core"), require("crypto/x64-core"), require("crypto/sha3"), require("crypto/hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./sha3", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA3;

}));