import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import GoogleLogin from 'react-google-login';
import { withAuthenticator, AmplifySignOut, AmplifyAmazonButton } from '@aws-amplify/ui-react'

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
      email: email
    })
    props.onSignIn(state);
  };

  

  return (
    <div>
      <h1>Vangal Cloud Alert Application</h1>
        <AmplifyAmazonButton 
          clientId={props.clientID_AWS}
          buttonId="Sign in with Google"
          onSuccess={onSignInAzure}
          onFailure={onSignInAzure}
          authCallback={onSignInAzure}
        />
        <br/>
        <MicrosoftLogin 
          clientId={props.clientID_Azure} 
          authCallback={onSignInAzure}
          />
        <br/>
        <GoogleLogin 
          clientId={props.clientID_Google} 
          buttonId="Sign in with Google"
          onSuccess={props.onSignInGoogle}
          onFailure={props.onSignInGoogle}
          cookiePolicy={'single_host_origin'}
        />
    </div>
  );  
}

export default LoginScreen;
