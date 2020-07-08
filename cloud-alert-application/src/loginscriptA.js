window.onAmazonLoginReady = function() {
    amazon.Login.setClientId('amzn1.application-oa2-client.58f592dc27c9454ca8c44ef43de17bb1');
};
(function(d) {
    var a = d.createElement('script'); a.type = 'text/javascript';
    a.async = true; a.id = 'amazon-login-sdk';
    a.src = 'https://assets.loginwithamazon.com/sdk/na/login1.js';
    d.getElementById('amazon-root').appendChild(a);
})(document);