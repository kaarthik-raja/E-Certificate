var fs = require('fs');
var contents = fs.readFileSync("./input.json");
var data = JSON.parse(contents);
User.updateMany({"Email":{$in:data} , 'accPayment.status':{$ne:'Credit'}, { $set: {'accPayment.status':'Credit'}})
	.then(users =>{
		console.log("Number of Updates Done is ",users.length);
		console.log("They are" );
		for (var i = 0; i < users.length; i++) {
			console.log(users[i]," ");
		}
		console.log("\n\nEND");
	});