var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
// var http = require('http');
var pdf = require('html-pdf');
// var sys = require('sys');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');
// var api="";
var sendgrid = require('sendgrid')("INSERT API KEY HERE");
// var nodemailer = require('nodemailer');
// var sleep = require('sleep');
var mailsent=0;
var contents = fs.readFileSync("./uploads/input.json");
var data = JSON.parse(contents);

function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
    // var modifiedFirstName = data[i].Name;
    var destinationEmail = data[i].Email;
    var text_body = "<html><body>Hello " + data[i].Name + "!<br>Greetings from Shaastra.<br><br>"+
    "Thanks for participating in this year's Sampark. Hope you had a good experience. Your e-certificate "+
    "has been attached herewith.<br><br>Hoping you see you in IIT Madras for Shaastra 2018!<br><br>"+
    'Thanks,<br><b>Team Shaastra</b>.<br><br>Follow us on <a href="https://www.facebook.com/Shaastra">Facebook</a> for more updates.</body></html>';

    fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
            console.log("mail Sent to ",destinationEmail);
            var params = {
                to: destinationEmail,
                // to: 'attacktitan100@gmail.com',
                from: 'sampark@shaastra.org',
                fromname: 'Shaastra Outreach',
                subject: 'E-certificate || Shaastra Sampark ',
                html : text_body,
                files: [{filename: 'e-certificate.pdf', content: data}]
            };
            var email = new sendgrid.Email(params);
            sendgrid.send(email, function (err, json) {
                if(err)console.log("error mailing @ ",destinationEmail);
                // mailsent+=1;
                // console.log("mailsent:",mailsent);
            });
        });

}

function pdfConvert(i){
    
  //   var dummyContent ='<!DOCTYPE html><html><head></head>'+
		// '<body><img style="width:95% ;" src="../uploads/participation.jpg">'+
		// '<style>  @font-face {font-family: Myfont;  src: url("./OpenSans-SemiboldItalic.ttf");} h2{ text-align: center;color: #053565;font-size:30px;font-family:Myfont;}</style>' +
		// '<div style="padding-left: 10%;">'+
		// '<h2 style="margin-top:-100%;text-align: center;"></h2>'+
		// '<h2 style="margin-top:51.5%;">' + data[i].Name +'</h2>'+
		// '<h2 style="margin-top:4%;">' + data[i].Position + '</h2>'+
		// '<h2 style="margin-top:-1.5%;">' + data[i].SubDept[0].toUpperCase() + data[i].SubDept.slice(1) + '</h2>'+
		// '<h2 style="margin-top:3.5%;">' + data[i].Dept+ '</h2>'+
		// '</div>'+
		// '</body></html>'

// the above one was for coordinator certificates


    var dummyContent = '<!DOCTYPE html><html><head></head>'+
        '<style>  @font-face {font-family: Myfont;  src: url("../OpenSans-SemiboldItalic.ttf");} h2{ position: absolute; text-align: center; top: 0%; width: 0%; color: #053565; font-size: 24px; font-family: Myfont;}</style>'+
        '<body><img style="width:83% ; margin-left:8%;" src="../uploads/Accomodation.jpg">'+
        '<img style="width:13% ;position:absolute; top: 4%;margin-left:-17.5%;" src="../QRCodes/Q1.svg">'+
        '<h2 style="top: 12.5%; margin-left: 23%;">'+data[i].Date+'</h2>'+
        '<h2 style="top: 18%; margin-left: 40%; width:30%;text-align:left;">'+data[i].Name+'</h2>'+
        '<h2 style="top: 22.5%; margin-left: 40%;">'+data[i].ShaastraID+'</h2>'+
        '<h2 style="top: 27%; margin-left: 40%;">'+data[i].MobileNo+'</h2>'+
        '<h2 style="top: 31%; margin-left: 40%;">'+data[i].Hostel+'</h2>'+
        '<h2 style="top: 35%; margin-left: 40%;">'+data[i].RoomNo+'</h2>'+
        '<h2 style="top: 42.5%; margin-left: 33%;">'+data[i].CautionDeposit+'</h2>'+
        '<h2 style="top: 48.5%; margin-left: 33%;">'+data[i].AccomodationCharge+'</h2>'+
        '<h2 style="top: 54.5%; margin-left: 33%;">'+data[i].TotalCost+'</h2>'+
        // '<h2 style="top: 54.5%; margin-left: 38%;">'+data[i].Paid+'</h2>'+
        '<h2 style="top: 65%; margin-left: 53%;">'+data[i].ACName+'</h2>'+
        '<h2 style="top: 68%; margin-left: 53%;">'+data[i].ACNum+'</h2>'+
        '<h2 style="top: 71.5%; margin-left: 53%;width:30%;text-align:left;">'+data[i].Bank+'</h2>'+
        '<h2 style="top: 74.5%; margin-left: 53%;">'+data[i].IFSC+'</h2>'+
        '<h2 style="top: 46.5%; margin-left: 77%;">'+'&#10004;'+'</h2>'+
        '<h2 style="top: 51.5%; margin-left: 77%;">'+'&#10007;'+'</h2>'+
        '<h2 style="top: 56.5%; margin-left: 77%;">'+'&#10007;'+'</h2>'+
        '</div></body></html>';

    var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
    var htmlFileName = "./htmls/" + modifiedFirstName +".html", pdfFileName = "./pdfs/"+ modifiedFirstName +".pdf";
	var htmlcreateName =  __dirname + "/htmls/" + modifiedFirstName +".html"
    // Save to HTML file
    fs.writeFile(htmlcreateName, dummyContent, function(err) {
        console.log("Came" + i);
        if(err) { throw err; }
        util.log("file saved to site.html");

        // var child = exec("firefox -print " + htmlFileName + " -printmode pdf " +  pdfFileName, function(err, stdout, stderr) {
        var child = exec("phantomjs rasterize.js " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
            if(err) { throw err; }
            util.log(stderr);
            // sendEmail(i);
        });    
    });
    // pdf.create(dummyContent).toFile(pdfFileName, function(err, res){
    //   console.log("created ",res.filename);
    // });
    // console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName);
}
// console.log("data ",data);
console.log("Path\n\n",__dirname);
for(var i=0; i<data.length; i++){
// for(var i=0; i<10; i++){
    pdfConvert(i);
}
