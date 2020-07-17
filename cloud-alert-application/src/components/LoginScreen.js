import React from 'react';
import AmazonButton from './AmazonButton.js'; 
import MicrosoftLogin from "react-microsoft-login";
import GoogleLogin from 'react-google-login';
import { withAuthenticator, AmplifySignOut, AmplifyAmazonButton } from '@aws-amplify/ui-react'
import './../style/LoginScreen.css';

import { AzureAD } from 'react-aad-msal';

let crypto = require("crypto-js");

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    //  dateStap format = YYYMMDD
    //  regionName = 'us-east-1'
    //  serviceName = 'iam'
    //
    var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = crypto.HmacSHA256(regionName, kDate);
    var kService = crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}


function LoginScreen(props) {

  let signature = getSignatureKey(props.clientID_AWS, '20200717', 'us-east-1', 'iam');
  console.log(signature);

  const onSignInAzure = (err, data) => {
    console.log(data)   
    let email = data.authResponseWithAccessToken.account.userName;
    let name = data.authResponseWithAccessToken.account.name;
    let loggedIn = err == null;
    
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        mode: 'no-cors',
        body: 'client_id=1854d86b-8e91-4db9-846e-0da965c041d6&scope=https://graph.microsoft.com/.default&client_secret=A8-q.GIe4_.J89_-cKglpduI9_jPJ-ijwj&grant_type=client_credentials'
        // body: JSON.stringify(
        // {
        //   client_id: '1854d86b-8e91-4db9-846e-0da965c041d6',
        //   scope: 'https://graph.microsoft.com/.default',
        //   client_secret: 'A8-q.GIe4_.J89_-cKglpduI9_jPJ-ijwj',
        //   grant_type: 'client_credentials'})
    };
    console.log(requestOptions);
    fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', requestOptions)
      // .then(async (response)=>response.json())
      //   .then(async (responseJson)=> {
      //     console.log(responseJson)
      // });    
    
    // .then(async response => {
    //       // const data = await response;
    //       const data = await response.json();
    //       console.log(data);
            
    // })
    .then(response => console.log(response))
    .catch(error => console.log(error));


    const state = ({
      loggedIn: loggedIn,
      error: err,
      name: name,
      email: email,
      service: 'Azure',
      data: data,
      bearerToken: ''
    })
    props.onSignIn(state);
  };

  const onSignInAmazon = (data) => {
    console.log(data);

    // var config = { 
    //   apiVersion: '2017-10-25',
    //   accessKeyId : 'AKIAJVCSKEY3SAMPLE',
    //   secretAccessKey : 'b5a51a9fa71de7e654643719fe64b2a944ca09415b4cea39a3ed3a9719f6ca82',
    //   region : 'us-east-1'
    // }

    // let CostExplorer = require('aws-cost-explorer');
    // var ce = CostExplorer();
    // ce.getMonthToDateCosts(null, function(err, data) {
    //   if (err) {
    //       console.log(err);
    //   } else {
    //       console.dir(data, { depth: null });
    //       console.log(data);
    //   }
    // });
    let email = data.profile.email;
    let name = data.profile.name;
    let loggedIn = true;



    const state = ({
      loggedIn: loggedIn,
      error: null,
      name: name,
      email: email,
      service: 'Amazon',
      data: data,
      bearerToken: ''
    })
    props.onSignIn(state);
  }
 
  return (
    <div class='center' >
      <center>
          <h1>Vangal Cloud Alert</h1>
      </center>
      <br/>
      <div style={{margin: 'auto', width:'215px'}}>

          <AmazonButton
              provider='amazon'
              appId={props.clientID_AWS}
              onLoginSuccess={onSignInAmazon}
              onLoginFailure={onSignInAmazon}
              onLogoutSuccess={onSignInAmazon}
              // getInstance={this.setNodeRef.bind(this, 'amazon')}
              key={'amazon'}>
                
          </AmazonButton>
          <br/>
          <MicrosoftLogin 
            clientId={props.clientID_Azure} 
            authCallback={onSignInAzure}
            // style={{margin: 'auto', width:'190px'}}
            // IdentityPoolId='us-east-1:945b28bc-b4a5-454e-8ca8-b588fe415b4e'
            graphScopes={['user.read']}
            buttonTheme='light'
          />
          <br/>
          <GoogleLogin 
            clientId={props.clientID_Google} 
            buttonId="Sign in with Google"
            onSuccess={props.onSignInGoogle}
            onFailure={props.onSignInGoogle}
            cookiePolicy={'single_host_origin'}
            style={{margin: 'ficed', width:'1950px'}}
            theme='dark'
            scope = "https://www.googleapis.com/auth/cloud-billing https://www.googleapis.com/auth/cloud-platform"
          />
        </div>
        <br/>
    </div>
  );  
}

export default LoginScreen;
