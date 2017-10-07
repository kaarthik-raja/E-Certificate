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

var contents = fs.readFileSync("./uploads/input.json");
var data = JSON.parse(contents);


function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
    // var modifiedFirstName = data[i].Name;
    var destinationEmail = data[i].Email;
    var text_body = "<html><body> Hello " + data[i].Name + " ,<br>Greetings from Shaastra, IIT Madras.<br><br>"+
    "Thanks for attending " + data[i].Workshop + " workshop in Sampark, " + data[i].City + ". Hope that you gained a lot from the experience and will learn further into the topic."+ 
    'You can find the presentations used during the workshop <a href="https://drive.google.com/open?id=0B_EwaAVQesWkNGVSSmdDb29pYVU">here</a>. ' +
    "<br><br>Also find attached a certificate for successful completion of the workshop by you."+
    "<br><br>Hoping you see you in IIT Madras for Shaastra 2018!<br><br>"+
    'Regards,<br>Team Shaastra.<br>Follow us on <a href="https://www.facebook.com/Shaastra">Facebook</a> for more updates. <br><br><br><br></body></html>';

    fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
            console.log(destinationEmail);
            var params = {
                to: destinationEmail,
                from: 'webops@shaastra.org',
                fromname: 'Shaastra Outreach',
                subject: 'E-Certificate || Shaastra Sampark ',
                html: text_body,
                files: [{filename: 'e-certificate.pdf', content: data}]
            };
            var email = new sendgrid.Email(params);
            sendgrid.send(email, function (err, json) {
                console.log('Error sending mail - ', err);
                console.log('Success sending mail - ', json);
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
        '<style>  @font-face {font-family: Myfont;  src: url("./OpenSans-SemiboldItalic.ttf");} h2{ position: absolute; text-align: center; top: 0%; width: 0%; margin-left: 0%; color: #053565; font-size: 30px; font-family: Myfont;}</style>'+
        '<body><img style="width:95% ;" src="../uploads/workshop.jpg">'+
        '<h2 style="top: 38.5%; margin-left: 34%; width: 36%;">'+data[i].Name+'</h2>'+
        '<h2 style="top: 44.5%; margin-left: 41.5%; width: 40%;">'+data[i].Workshop+'</h2>'+
        '<h2 style="top: 60%; margin-left: 55%; width: 25%;">'+data[i].City+'</h2>'+
        '</div></body></html>'


    var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
    var htmlFileName = "htmls/"+ modifiedFirstName +".html", pdfFileName = "pdfs/"+ modifiedFirstName +".pdf";

    // Save to HTML file
    fs.writeFile(htmlFileName, dummyContent, function(err) {
        // console.log("Came" + i);
        if(err) { throw err; }
        
        var child = exec("wkhtmltopdf -O landscape " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
            if(err) { throw err; }
            util.log(stderr);
            sendEmail(i);
        });    
    });
    console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName);
}

for(var i=0; i<data.length; i++){
    pdfConvert(i);
}
