    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var http = require('http');
    var sys = require('sys');
    var exec = require('child_process').exec;
    var util = require('util');
    var fs = require('fs');
    // var api_key = '';
    // var sendgrid = require('sendgrid')(api_key);
    // var nodemailer = require('nodemailer');
    var sleep = require('sleep');

    var contents = fs.readFileSync("./uploads/output.json");
    var data = JSON.parse(contents);


    function sendEmail(i){
        // Convert HTML to PDF with wkhtmltopdf
        console.log("Come" + i);
        var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
        // var modifiedFirstName = data[i].Name;
        var destinationEmail = data[i].Email;
        var text_body = "Thank you for aParticipating in Shaastra. PFA your e-certificate.";  
        fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
                console.log(destinationEmail);
                var params = {
                    to: destinationEmail,
                    from: 'support@shaastra.org',
                    fromname: 'Shaastra Outreach',
                    subject: 'Shaastra 2016 || E-certificate',
                    text: text_body,
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
        console.log(i);
        var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/participation.jpg"><h3 style="position:absolute;top:42.5%;left:35%">' + data[i].Name + '</h3><h3 style="position:absolute;top:47%;left:32%">' + data[i].SubDept + '</h3><h3 style="position:absolute;top:51.5%;left:45%">' + data[i].Dept + '</h3></body></html>';
        // var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/winnerscertificate.jpg"><h3 style="position:absolute;top:42.5%;left:35%">Howard</h3><h3 style="position:absolute;top:47%;left:32%">IIT Madras</h3></body></html>';
        var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
        var htmlFileName = "htmls/"+ modifiedFirstName +".html", pdfFileName = "pdfs/"+ modifiedFirstName +".pdf";
    
        // Save to HTML file
        fs.writeFile(htmlFileName, dummyContent, function(err) {
            console.log("Came" + i);
            if(err) { throw err; }
            util.log("file saved to site.html");

            var child = exec("wkhtmltopdf " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
                if(err) { throw err; }
                util.log(stderr);
                console.log("Came 2" + i);
                // sendEmail(i);
            });
            
        });
    
        

        console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName + '\n');
    }

    for(var i=0; i<data.length; i++){
        pdfConvert(i);

    }
