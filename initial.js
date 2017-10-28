var node_xj = require("xls-to-json");

node_xj({
        input: "./uploads/input1.xls",
        output: "./uploads/input.json"
    }, function(err, result) {
        if(err) {
          console.error(err);
        } else {
          console.log(result);
        }
    });
