const router = require('express').Router();

router.route('/:id').get((req, res) => {
    // let accountId = 'AE2RW6W34NPM4S7MZ6XDHY3OXUQQ'; // amzn1.account.AE2RW6W34NPM4S7MZ6XDHY3OXUQQ
    let accountId = req.params.id;
    let key = 'amzn1.application-oa2-client.58f592dc27c9454ca8c44ef43de17bb1';
    let secret = 'b5a51a9fa71de7e654643719fe64b2a944ca09415b4cea39a3ed3a9719f6ca82';
    let bucket = 'company-aws-billing';
    let region = 'us-west-2';

    let billing = require('aws-billing')(accountId, key, secret, bucket, region);

    billing(function (err, costs) {
      console.log('err', err);
      console.log('costs', costs);
      res.send(costs);
    });
    
});

module.exports = router;