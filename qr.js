// var qr = require('qr-image');
 
// var qr_svg = qr.image('I love QR!', { type: 'svg' });
// qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
 
// var svg_string = qr.imageSync('I love Raja!', { type: 'svg' });
// console.log(qr_svg);
// console.log("\n\n\n\n");
// console.log(svg_string);
var keyczar = require('./keyczar');

// Create a new keyset and serialize it
var keyset = keyczar.create(keyczar.TYPE_AES);
var keysetSerialized = keyset.toJson();

// Load the keyset and use it
var plaintext = 'hello message';
keyset = keyczar.fromJson(keysetSerialized);
var encrypted = keyset.encrypt(plaintext);
var decrypted = keyset.decrypt(encrypted);
console.log('plaintext:', plaintext);
console.log('encrypted:', encrypted);
console.log('decrypted:', decrypted);

// Create an asymmetric key
var private = keyczar.create(keyczar.TYPE_RSA_PRIVATE);
var public = private.exportPublicKey();
var privateSerialized = private.toJson();

// encrypt some data in a "session" to avoid asymmetric length limits
var session = keyczar.createSessionCrypter(public);
encrypted = session.encrypt(plaintext);
var sessionMaterial = session.sessionMaterial;

// take the private key and the session material to decrypt the data
private = keyczar.fromJson(privateSerialized);
session = keyczar.createSessionCrypter(private, sessionMaterial);
decrypted = session.decrypt(encrypted);
console.log('plaintext:', plaintext);
console.log('sessionMaterial:', sessionMaterial);
console.log('encrypted:', encrypted);
console.log('decrypted:', decrypted);

// convenience method to pack session material together with the message
encrypted = keyczar.encryptWithSession(public, plaintext);
decrypted = keyczar.decryptWithSession(private, encrypted);
console.log('plaintext:', plaintext);
console.log('encrypted:', encrypted);
console.log('decrypted:', decrypted);