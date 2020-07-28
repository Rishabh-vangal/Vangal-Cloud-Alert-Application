const express = require('express');
const router = require('express').Router();
const app = express();
const cors = require('cors');

let AzureData;
let GoogleData;

app.use(cors());
app.use(router);

app.get('/Azure/GetCredentialLog', (req, res) => {
    res.send(AzureData);
});

app.get('/Google/GetCredentialLog', (req, res) => {
    res.send(GoogleData);
});


router.route('/Google/:id').post((req, res) => {
    // console.log(req);
    console.log(req.params.id);
    GoogleData.push(req.params.id);
    res.send();
});

app.get('/AWS', (req, res) => {
    let accountId = 'AE2RW6W34NPM4S7MZ6XDHY3OXUQQ'; // amzn1.account.AE2RW6W34NPM4S7MZ6XDHY3OXUQQ
    let key = 'qwer';
    let secret = 'qwer';
    let bucket = 'company-aws-billing';
    let region = 'us-west-2';

    let billing = require('aws-billing')(accountId, key, secret, bucket, region);

    billing(function (err, costs) {
      console.log('err', err);
      console.log('costs', costs);
    });


    let config = { 
        apiVersion: '2017-10-25',
        accessKeyId : 'amzn1.application-oa2-client.58f592dc27c9454ca8c44ef43de17bb1',
        secretAccessKey : 'b5a51a9fa71de7e654643719fe64b2a944ca09415b4cea39a3ed3a9719f6ca82',    // Atza|IwEBIAKNpwyduT7xGnVyAmrzTa4JEjz4EIQRXcsejXL3MvEKBbX9KQndY5yaPAriZgKkqAdicMyAQb_lkTzdGLbW2tyKUSrGJM0HEIKz6scPWRKonH3LKZPZcugxKy-S4eVR3P7-sQHrRi3Ly_j7_x2M7ih6HWIecLjE4ec7DnP-KLuVlBAk4yFvNEEmehlevuI_OwFtb5xABogvxsQbLcFJ3sPL30DUivvjC0sU65yLOle1awn_3p0s3mJzTQSSV9ZNqgfJrqp10FOrn34sCyUki6ZzR9n-so0NuAtXJTfdoEWb-uyknIR-g4fRQtVV7KESs5PL5QXLYeACWsUGZiN1iYA2xvmUHvpSjn3m6wS9J1aswnW63A5EVeePDpOC0aJzn2EPc_rSlYz-ls-6Ks7UeLs2EjkhNL2RU1K5Lj7yTZxllA
        region : 'us-east-1'
    }
    
    let CostExplorer = require('aws-cost-explorer');
    let ce = CostExplorer(config);
    
    ce.getMonthToDateCosts(null, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.dir(data, { depth: null });
        }
    });

    res.send('success');
});

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

app.listen(8080, function() {
    AzureData = [];
    GoogleData = [];

    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
    }
   console.log('Running on port 8080'); 
});