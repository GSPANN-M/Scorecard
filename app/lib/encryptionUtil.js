var STATIC_KEY = "2128234c414d4029",
    DYNAMIC_KEY_LENGTH = 8,
    IV_LENGTH = 16,
    DYNAMIC_KEY_LENGTH_IN_BYTES = DYNAMIC_KEY_LENGTH * 2,
    IV_LENGTH_IN_BYTES = IV_LENGTH * 2,
    IV_BYTES_LAST_INDEX = DYNAMIC_KEY_LENGTH_IN_BYTES + IV_LENGTH_IN_BYTES,
    c = require("crypto/core"),
    aes = require("crypto/aes");

function encrypt(plainText) {
	var encryptDynamicKey = c.enc.Utf8.parse(getRandomString(DYNAMIC_KEY_LENGTH));
	var encryptIV = c.lib.WordArray.random(IV_LENGTH);
	var encryptFinalKey = c.enc.Hex.parse(STATIC_KEY).concat(encryptDynamicKey);
	var encryptedData = aes.encrypt(plainText, encryptFinalKey, {
		iv : encryptIV
	}).ciphertext;
	return c.enc.Base64.stringify(encryptDynamicKey.concat(encryptIV).concat(encryptedData));
}

function decrypt(cipherText) {
	cipherText = c.enc.Base64.parse(cipherText).toString();
	var decryptFinalKey = c.enc.Hex.parse(STATIC_KEY.concat(cipherText.substring(0, DYNAMIC_KEY_LENGTH_IN_BYTES)));
	var decryptIV = c.enc.Hex.parse(cipherText.substring(DYNAMIC_KEY_LENGTH_IN_BYTES, IV_BYTES_LAST_INDEX));
	return aes.decrypt({
		ciphertext : c.enc.Hex.parse(cipherText.substring(IV_BYTES_LAST_INDEX))
	}, decryptFinalKey, {
		iv : decryptIV
	}).toString(c.enc.Utf8);
}

/**
 * Get random string
 * @param {Number} _length The length of the string
 */
function getRandomString(_length) {
	var text = "";
	var possible = "0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";

	for (var i = 0; i < _length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
