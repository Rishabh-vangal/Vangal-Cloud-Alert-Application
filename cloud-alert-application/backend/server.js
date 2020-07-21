const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/test', (req, res) => {
    console.log('/test');
    var msRestAzure = require("ms-rest-azure")
    msRestAzure.interactiveLogin(function(err, credentials) {
        if (err) 
        {
            return console.log(err);
        }
        console.log(credentials);
        res.send(credentials);
    });
});

app.listen(8080, function() {
   console.log('Running on port 8080'); 
});