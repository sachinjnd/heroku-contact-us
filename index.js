var express = require('express');
var app = express();
var Mailgun = require('mailgun-js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*app.get('/', function(request, response) {
  response.render('pages/index');
});*/

var api_key = 'MAILGUN-API-KEY';
var domain = 'YOUR-DOMAIN.com';
var from_who = 'your@email.com';


app.get('/submit', function(req, res) {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: req.params.mail,
    //Subject and text data  
      subject: 'Hello from Mailgun',
      html: ''
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


