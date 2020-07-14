import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import GoogleLogin from 'react-google-login';
import { withAuthenticator, AmplifySignOut, AmplifyAmazonButton } from '@aws-amplify/ui-react'
import './../style/LoginScreen.css';

function LoginScreen(props) {

  const onSignInAzure = (err, data) => {
    console.log(data)   
    let email = data.authResponseWithAccessToken.account.userName;
    let name = data.authResponseWithAccessToken.account.name;
    let loggedIn = err == null;
    const state = ({
      loggedIn: loggedIn,
      error: err,
      name: name,
      email: email,
      service: 'Azure',
      data: data
    })
    props.onSignIn(state);
  };

  return (
    <div class='center' >
      <center>
          <h1>Vangal Cloud Alert</h1>
      </center>
      <br/>
      <div style={{margin: 'auto', width:'215px'}}>
          <AmplifyAmazonButton 
            clientId={props.clientID_AWS}
            buttonId="Sign in with Google"
            onSuccess={onSignInAzure}
            onFailure={onSignInAzure}
            authCallback={onSignInAzure}
          />
          {/* <br/> */}
          <MicrosoftLogin 
            clientId={props.clientID_Azure} 
            authCallback={onSignInAzure}
            style={{margin: 'auto', width:'190px'}}
          />
          <br/>
          <GoogleLogin 
            clientId={props.clientID_Google} 
            buttonId="Sign in with Google"
            onSuccess={props.onSignInGoogle}
            onFailure={props.onSignInGoogle}
            cookiePolicy={'single_host_origin'}
            style={{margin: 'auto', width:'190px'}}
            // scope="https://www.googleapis.com/auth/cloud-platform"
            // scope = "https://www.googleapis.com/auth/cloud-billing"
            scope = "https://www.googleapis.com/auth/cloud-billing https://www.googleapis.com/auth/cloud-platform"
          />
        </div>
        <br/>
    </div>
  );  
}

export default LoginScreen;
