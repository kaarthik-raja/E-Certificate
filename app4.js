var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
var http = require('http');
// var sys = require('sys');
var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');

var sendgrid = require('sendgrid')("INSERT API KEY HERE");
// var nodemailer = require('nodemailer');
// var sleep = require('sleep');

var contents = fs.readFileSync("./uploads/output.json");
var data = JSON.parse(contents);

var count = 0;
function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    var modifiedFirstName = data[i].A.replace(/[^a-zA-Z0-9]/g, '');
    // var modifiedFirstName = data[i].Name;
    var destinationEmail = data[i].B;
    var text_body = 'Hello\nGreetings from Shaastra, IIT Madras.\n\nIgnore any previous mail, if you have received any.\n\nThank you for registering for Pune Sampark.\nDue to some unfortunate and unavoidable problems with the venue, we have to shift the venue of our event to Vishwakarma Institute of Information Technology, (VIIT).\n'+
        'Due to limited seating, we had to shortlist only some registrations.\nThe selection was purely based on first come first serve basis and no other criteria. \nWe are extremely sorry to inform you that we cannot accomodate you tomorrow for the workshop. \nPlease like our facebook page for information on further events.\n\n\n'+
        'The inconvenience caused is regretted.\nTeam Shaastra,\nIIT Madras\n\n\n\n';

    // fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
            console.log(destinationEmail);
            var params = {
                to: destinationEmail,
                from: 'webops@shaastra.org',
                fromname: 'Shaastra Outreach',
                replyTo: 'shaastra.maharashtra@gmail.com',
                subject: 'Pune Sampark || Venue Change',
                text: text_body,
                // files: [{filename: 'e-certificate.pdf', content: data}]
            };
            var email = new sendgrid.Email(params);
            sendgrid.send(email, function (err, json) {
                console.log('Error sending mail - ', err);
                console.log('Success sending mail - ', json);
                if(!err)
                {
                    count += 1
                    console.log(count);
                }
            });
        // });

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

// the above one was for coordinator certificate


    var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
    var htmlFileName = "htmls/"+ modifiedFirstName +".html", pdfFileName = "pdfs/"+ modifiedFirstName +".pdf";

    // Save to HTML file
    // fs.writeFile(htmlFileName, dummyContent, function(err) {
    //     // console.log("Came" + i);
    //     if(err) { throw err; }
    //     util.log("file saved to site.html");

    //     var child = exec("wkhtmltopdf -O landscape " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
    //         if(err) { throw err; }
    //         util.log(stderr);
    //         // sendEmail(i);
    //     });    
    // });
    // console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName);
}

for(var i=0; i<data.length; i++){
    // pdfConvert(i);
    sendEmail(i);
}
