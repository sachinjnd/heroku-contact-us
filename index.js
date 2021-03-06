var express = require('express');
var bodyParser = require('body-parser');
var Mailgun = require('mailgun-js');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*app.get('/', function(request, response) {
  response.render('pages/index');
});*/

var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.YOUR_DOMAIN;
var from_who = process.env.FROM_EMAIL;
var to_who = 'sachingarg.space@gmail.com';


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.post('/submit', function(req, res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: to_who,
    //Subject and text data  
      subject: 'sachingarg.space - ' + req.body.email,
      html: req.body.message + '<br/><br/>Regards<br/>' + req.body.name
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.send("failed");
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.send("success");
            //console.log(body);
        }
    });

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


