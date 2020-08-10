const router = require('express').Router();

let AzureData = [];
let azureSignInCode;

router.route('/GetCredentialLog').get((req, res) => {
    res.send(AzureData);
});

router.route('/SignInCode').get((req, res) => {
    setTimeout(function() {
        console.log(azureSignInCode);
        res.send(azureSignInCode);
    }, 4000);    
});

router.route('/SignIn').get((req, res) => {
    console.logs = [];
  
    var msRestAzure = require("ms-rest-azure")
    const BillingManagement = require('azure-arm-billing');
    msRestAzure.interactiveLogin(function(err, credentials) {
        if (err) 
        {
            return console.log(err);
        }
        AzureData.push(credentials)
        res.send(credentials);
    });

    setTimeout(function() {
        azureSignInCode = {
            'URL': console.logs[0][0].split(' ')[11],
            'Code': console.logs[0][0].split(' ')[16]
        }; 
    }, 4000);
});

module.exports = router;