var express = require('express');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var client = require('twilio')
("ACa0d26c0bae57769545b4ff757fd4a1bf", 
    "f4fe75ba303dff1eac35e7ab7516ed83");
var request = require('request');

// var myTwilioAccount = process.env.TWILIO_ACCOUNT_SID;
// var myTwilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
// var myTwilioNumber = process.env.TWILIO_NUMBER;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', function(req, res){
    res.send('hello from heroku');
});

app.get('/test', function(req, res){
    res.send('Welcome from heroku');
});

app.post('/sms', function(req, res) {
  var twilio = require('twilio');
  console.log('received a text message');
  console.log(req.body);
  var twiml = new twilio.TwimlResponse();
  var reply = 'You sent \n"' + req.body.Body + '"';
  var apiKey = "56436006fa6774f1436ebcccb8e09803";
  var baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
  var zip = req.body['FromZip'] ;
  var city = req.body['FromCity'];
  console.log(city);
  console.log(zip);

  var reqUrl = baseUrl + zip + ',us&appid=' + apiKey;
  console.log(reqUrl);
  request(reqUrl, function(error, response, body){
    var jsonBody = JSON.parse(body);
    if (!error && response.statusCode == 200) {
    console.log(jsonBody.main.temp);
    var weatherElements = '';
    jsonBody.weather.forEach(function(element){
        console.log(element.main);
        weatherElements += (' ' + element.main )
    });
    console.log(jsonBody.name)
    }
    var myTemp = jsonBody.main.temp -273.15;
    myTemp = myTemp * (9/5) + 32;
    // myTemp = Math.ceil(myTemp * 100) / 100;
    myTemp = Math.ceil(myTemp);

    var replyString = ' \n\nWeather in ' + city + ' is '+  myTemp + 'F'
    + '\nExpect' + weatherElements + '.';
    console.log(replyString);
    twiml.message(replyString);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
});

app.get('/reply', function(req, res){
    res.send('reply');
    client.sendMessage({
    to:'+15104146669', // Any number Twilio can deliver to
    from: "+15109013064", // A number you bought from Twilio and can use for outbound communication
    body: 'This is a test message.' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio
    console.log(responseData);
    if (!err) { // "err" is an error received during the request, if any
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
    }
});
});

app.listen(3000, function(){
    console.log('app running on port 3000');
});
