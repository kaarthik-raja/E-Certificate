var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
var pdf = require('html-pdf');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');
var sendgrid = require('sendgrid')(" ");
var mailsent=0;
var contents = fs.readFileSync("./uploads/input.json");
var picture = fs.readFileSync("./MarianaBO.jpeg");
var logo = fs.readFileSync("./logo.jpeg");
var data = JSON.parse(contents);
function sendEmail(i){
    // Convert HTML to PDF with wkhtmltopdf
    // console.log("Come" + i);
    // var destinationEmail =    'kaarthikrajamv@gmail.com';
    var destinationEmail = data[i].Email;
    var text_body = '<html><body>Greetings from Shaastra 2018! <br><br>We hope this New Year brings loads of adventure, pleasant surprises and tremendous joy.<br><br>To make this New Year a grand affair we have a special offer for you! Now get <b>fan passes to the EDM Night at 50% discount</b>!<br><br>This is a <b>limited period offer</b> so hurry before the passes run out! Get your discounted fan passes <a href="https://www.instamojo.com/Shaastra/shaastra-edm-night-fan-pass/">here</a><br><br>We have a lot planned for you. So come, join us, and lets start this New Year, the right way. <br><br>Cheers,<br>Team Shaastra<br><br><br>Follow us on <a href="https://www.facebook.com/Shaastra">Facebook</a> for more updates.<br><br><img src="cid:edminvite"/><img style="width:100%" src="cid:logo"/></body></html>';
        var params = {
            to: destinationEmail,
            from: 'shows@shaastra.org',
            fromname: 'Shaastra EDM',
            subject: 'EDM Show || Shaastra 2018',
            html : text_body,
            files: [{filename: 'EDM.jpeg', content: picture ,contentType:'image/jpeg',cid:'edminvite'},
            {filename: 'logos.jpeg', content: logo ,contentType:'image/jpeg',cid:'logo'}]
        };
        var email = new sendgrid.Email(params);
        console.log("mail function to ",destinationEmail);

        sendgrid.send(email, function (err, json) {
            if(!err)console.log("mail Sent to ",destinationEmail);
            if(err){console.log("error mailing @ ",destinationEmail);}
            // mailsent+=1;
            // console.log("mailsent:",mailsent);
        });

}
for(var i=0; i<data.length; i++){
// for(var i=0; i<3; i++){
    sendEmail(i);
}
