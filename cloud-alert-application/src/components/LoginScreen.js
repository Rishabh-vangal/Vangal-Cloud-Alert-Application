import React from 'react';
import AmazonButton from './AmazonButton.js'; 
import MicrosoftLogin from "react-microsoft-login";
import GoogleLogin from 'react-google-login';
import { withAuthenticator, AmplifySignOut, AmplifyAmazonButton } from '@aws-amplify/ui-react'
import './../style/LoginScreen.css';
import axios from 'axios';


function LoginScreen(props) {
  const onSignInMicrosoft = () => {
    axios.get('/test').then(response => {
      console.log(response.data);
      console.log(response.data.tokenCache._entries);
      console.log(response.data.tokenCache._entries[1].accessToken);
      let email = response.data.username;
      let name = response.data.tokenCache._entries[1].givenName + ' ' + response.data.tokenCache._entries[1].familyName;
      let loggedIn = true;
      let bearerToken = 'Bearer ' + response.data.tokenCache._entries[1].accessToken;

      axios.get('https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview', {headers: {'Authorization': bearerToken}})
        .then(response => {
            console.log(response.data.value);

            const state = ({
              loggedIn: loggedIn,
              error: null,
              name: name,
              email: email,
              service: 'Azure',
              data: response.data.value,
              bearerToken: bearerToken
            })
            props.onSignIn(state);
        })
        .catch(error => console.log(error));     
    });
  }

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
    };
    console.log(requestOptions);
    fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', requestOptions)
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
            graphScopes={['user.read']}
            buttonTheme='light'
          />
          <button onClick={onSignInMicrosoft}>Sign in with Microsoft (new)</button>
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
