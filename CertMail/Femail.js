var fs = require('fs');
var sendgrid = require('sendgrid')()
var mailsent=0;
var event= process.argv.slice(2) + ' signed' ;
var contents = fs.readdirSync(__dirname + '/'+ event );

contents=contents.forEach(file => {
  file=file.slice(0, -4);
    var text_body = "<html><body>Hello!<br>Greetings from Shaastra.<br><br>"+
    "Thanks for participating in this year's Shaastra. Hope you had a good experience. Your e-certificate "+
    "has been attached herewith.<br><br><b>Please open the certificate with the lastest version of Adobe Acrobat Reader PDF Software only</b><br><br>Hoping to you see you in IIT Madras for Shaastra 2019!<br><br>"+
    'Thanks,<br><b>Team Shaastra</b>.<br><br>Follow us on <a href="https://www.facebook.com/Shaastra">Facebook</a> for more updates.</body></html>';

    fs.readFile('./'+ event  + '/'+ file+'.pdf',function(err,data){
            var params = {
                to: file,
                // to: 'attacktitan100@gmail.com',
                from: 'certificates@shaastra.org',
                fromname: 'Team Shaastra',
                subject: 'E-certificate || Shaastra 2018',
                html : text_body,
                files: [{filename: 'e-certificate.pdf', content: data}]
            };
            var email = new sendgrid.Email(params);
            sendgrid.send(email, function (err, json) {
                if(!err)
                console.log("mail Sent to ",file);
                if(err)console.log("error mailing @ ",file);
                // mailsent+=1;
                // console.log("mailsent:",mailsent);
            });
        });
})



// console.log(data.length);
// // for(var i=0; i<data.length; i++)
// for(var i=0; i<1; i++)
// {
//     // sendEmail(i);
// }
