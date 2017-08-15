    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var http = require('http');
    // var sys = require('sys');
    var exec = require('child_process').exec;
    var util = require('util');
    var fs = require('fs');
    var api_key = '';
    api_key= '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';
    var sendgrid = require('sendgrid')(api_key);
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
        var text_body = "Thank you for Participating in Shaastra. PFA your e-certificate.";  
        fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
                console.log(destinationEmail);
                var params = {
                    to: destinationEmail,
                    from: 'support@shaastra.org',
                    fromname: 'Shaastra Outreach',
                    subject: 'Sample || E-certificate ||  Shaastra 2016 ',
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
        
        // var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/participation.jpg"><h3 style="position:absolute;top:42.5%;text-align:center;">' + data[i].Name + '</h3><h3 style="position:absolute;top:47%;text-align:center;">' + data[i].SubDept + '</h3><h3 style="position:absolute;top:51.5%;text-align:center;">' + data[i].Dept + '</h3></body></html>';
        var dummyContent ='<!DOCTYPE html><html><head></head>'+
			'<body><img style="width:95% ;" src="../uploads/participation.jpg">'+
			'<div style="padding-left: 10%;">'+
			'<h2 style="margin-top:-100%;text-align: center;"></h2>'+
			'<h2 style="margin-top:52%;text-align: center;">' + data[i].Name.toUpperCase() +'</h2>'+
			'<h2 style="margin-top:5%;text-align: center;">' + data[i].Position + '</h2>'+
			'<h2 style="margin-top:2%;text-align: center;">' + data[i].SubDept[0].toUpperCase() + data[i].SubDept.slice(1) + '</h2>'+
			'<h2 style="margin-top:4.5%;text-align: center;">' + data[i].Dept+ '</h2>'+
			'</div>'+
			'</body></html>'
        // var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/winnerscertificate.jpg"><h3 style="position:absolute;top:42.5%;left:35%">Howard</h3><h3 style="position:absolute;top:47%;left:32%">IIT Madras</h3></body></html>';
        var modifiedFirstName = data[i].Name.replace(/[^a-zA-Z0-9]/g, '');
        var htmlFileName = "htmls/"+ modifiedFirstName +".html", pdfFileName = "pdfs/"+ modifiedFirstName +".pdf";
    
        // Save to HTML file
        fs.writeFile(htmlFileName, dummyContent, function(err) {
            console.log("Came" + i);
            if(err) { throw err; }
            util.log("file saved to site.html");

            var child = exec("wkhtmltopdf -O landscape --disable-smart-shrinking " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
                if(err) { throw err; }
                util.log(stderr);
                console.log("Came 2" + i);
                sendEmail(i);
            });
            
        });
    
        

        console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName + '\n');
    }

    for(var i=0; i<data.length; i++){
        pdfConvert(i);

    }
