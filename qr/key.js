var qr = require('qr-image');
fs = require('fs')
var NodeRSA = require('node-rsa');
var pub=fs.readFileSync('public.txt', 'utf8');
var pvt=fs.readFileSync('private.txt', 'utf8');
var key = new NodeRSA();
key.importKey(pvt,"pkcs8-private");
key.importKey(pub,"pkcs8-public-pem");

var contents = fs.readFileSync("../uploads/input.json");
var data = JSON.parse(contents);
// console.log("Path\n\n",__dirname);
function QRgen(i) {
	var encrypted = key.encrypt(data[i].ShaastraID, 'base64');
	var qr_svg = qr.image(encrypted, { type: 'svg' });
	qr_svg.pipe(fs.createWriteStream('../QRCodes/'+ data[i].ShaastraID + '.svg'));
}
for(var i=0; i<data.length; i++){
// for(var i=0; i<10; i++){
    QRgen(i);
}
