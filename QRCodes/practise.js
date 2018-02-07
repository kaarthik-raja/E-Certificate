const request = require("request");

const url =
  "http://shaastra.org:8000/api/users/getmember/SHA1806515";

request.get(url, (error, response) => {
  let json = JSON.parse(response.body);
  console.log(json.user);
});
