const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

let azureSignInCode;

app.get('/Azure/SignInCode', (req, res) => {
    setTimeout(function() {
        console.log(azureSignInCode);
        res.send(azureSignInCode);
    }, 4000);    
});

app.get('/Azure/SignIn', (req, res) => {
    console.logs = [];
  
    var msRestAzure = require("ms-rest-azure")
    msRestAzure.interactiveLogin(function(err, credentials) {
        if (err) 
        {
            return console.log(err);
        }
        res.send(credentials);
    });

    setTimeout(function() {
        azureSignInCode = {
            'URL': console.logs[0][0].split(' ')[11],
            'Code': console.logs[0][0].split(' ')[16]
        }; 
    }, 4000);
});

app.listen(8080, function() {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
    }
   console.log('Running on port 8080'); 
});