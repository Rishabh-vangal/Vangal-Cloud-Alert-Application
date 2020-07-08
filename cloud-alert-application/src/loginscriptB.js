document.getElementById('LoginWithAmazon').onclick = function() {
    options = {}
    options.scope = 'profile';
    options.scope_data = {
        'profile' : {'essential': false}
    };
    amazon.Login.authorize(options,
        'https://www.bing.com');
    return false;
};