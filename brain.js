var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
var pdf = require('html-pdf');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');
var sendgrid = require('sendgrid')("");
var contents = fs.readFileSync("./uploads/input.json");
var data = JSON.parse(contents);
function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    // var destinationEmail =    'rishanthmaanav@gmail.com';
    // var destinationEmail =    'kaarthikrajamv@gmail.com';
    var destinationEmail = data[i].Email;
    var text_body ='<html><body>Dear AWS Deep Learning Hackathon Participant,<br><br>Sorry for the inconvenience.The selection list has been mailed separately.Your score in the test was ' + data[i].Score + '<br><br>Thanks and Regards,<br>Organizing Team, Shaastra 2018.<br><br><br></body></html>';
            var params = {
            to: destinationEmail,
            from: 'awsdlsummit@shaastra.org',
            fromname: 'AWS , Shaastra',
            subject: 'AWS DL Hackathon',
            html : text_body
        };
        var email = new sendgrid.Email(params);
        // console.log("mail function to ",destinationEmail);

        sendgrid.send(email, function (err, json) {
            if(!err)console.log("mail Sent to ",destinationEmail);
            if(err){console.log("error mailing @ ",destinationEmail,err);}
            // mailsent+=1;
            // console.log("mailsent:",mailsent);
        });

}
console.log("length =",data.length);
for(var i=0; i<data.length; i++){
// for(var i=0; i<1; i++){
    sendEmail(i);
}