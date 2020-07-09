import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import GoogleLogin from 'react-google-login';

function LoginScreen(props) {

  const onSignInAzure = (err, data) => {
    let email = data.authResponseWithAccessToken.account.userName;
    let name = data.authResponseWithAccessToken.account.name;
    let loggedIn = err == null;
    const state = ({
      loggedIn: loggedIn,
      error: err,
      name: name,
      email: email
    })
    console.log(data.authResponseWithAccessToken)   
    props.onSignIn(state);
  };

  

  return (
    <div>
      <h1>Vangal Cloud Alert Application</h1>
        <MicrosoftLogin 
          clientId={props.clientID_Azure} 
          authCallback={onSignInAzure}
          />
        <br />
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
