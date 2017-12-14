fs = require('fs');
var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 1024});
key.exportKey("pkcs8-private");
key.exportKey("pkcs8-public-pem");
fs.writeFile('public.txt', key.exportKey("pkcs8-public-pem"));
fs.writeFile('private.txt', key.exportKey("pkcs8-private"));