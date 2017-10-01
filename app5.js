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

var contents = fs.readFileSync("./uploads/selected.json");
var data = JSON.parse(contents);
var count = 0;

function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    var modifiedFirstName = data[i].A.replace(/[^a-zA-Z0-9]/g, '');
    // var modifiedFirstName = data[i].Name;
    var destinationEmail = data[i].B;
    var text_body = 'Hello\nGreetings from Shaastra, IIT Madras.\n\nThank you for registering for Pune Sampark.\nDue to some unfortunate and unavoidable problems with the venue, we have to shift the venue of our event to Vishwakarma Institute of Information Technology, (VIIT).\n'+
        'Due to limited seating, we had to shortlist only some registrations. We are happy to inform you that you are one of them. So please do attend the event at the above mentioned venue. The timings for the events will remain same as before, so please be present according to time of whichever events / workshops you have registered for.'+
        'The timings are mentioned again below for reference:\n\n1. Brain Squeeze - Competitive event\n'+
        '10AM to 11AM\nLove solving logic puzzles? Make sure you are here and win this one. This will be a team event in a team of 2, though registrations are individual. Do not worry if you do not have a team mate, we will team you up.\n\n'+
        '11:00 am - 11:30 pm   Discussion of solutions to Brain Squeeze, Q&A Session\n\n'+
        '2. Workshop - Basics of Machine Learning\n'+
        '12:30AM to 3PM\n'+
        'Interested in knowing how machines improve their performance on their own? Curious about how Artificial Intelligence works? Attend this workshop which will explain all these concepts from the scratch.\n\n'+
        '3. Workshop - Introduction to Arduino\n'+
        '3.15PM to 5.45PM\n'+
        'Arduino is a microcontroller device which has various applications in robotics and other mechatronic systems. In this workshop you will learn the basics and get some hands on experience of Arduino Programming.\n'+
        'Bring your fully charged laptops for this workshop (at least one in three people).\n\n'+
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
                    {count+=1; console.log(count);}
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
