import React from 'react';
import AmazonButton from './AmazonButton.js'; 
import GoogleLogin from 'react-google-login';
import './../style/LoginScreen.css';
import axios from 'axios';


function LoginScreen(props) {
  const onSignInMicrosoft = () => {
    axios.get('http://localhost:8080/Azure/SignIn').then(response => {
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

    axios.get('http://localhost:8080/Azure/SignInCode')
      .then(response => {
        console.log(response.data);
        alert('Enter this code in the popup window to sign in: ' + response.data.Code);
        let popupWindow = window.open(response.data.URL,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
      })
      .catch(error => console.log(error));     


    
  }

  const onSignInAmazon = (data) => {
    let email;
    let name;
    let loggedIn;
    let accountId;

    if (data.profile){
      console.log(data);
      email = data.profile.email;
      name = data.profile.name;
      loggedIn = true;
      accountId = data.profile.id.split(".")[2];
    }
    else {
      email = 'data.profile.email';
      name = 'data.profile.name';
      loggedIn = true;
      accountId = 'data.profile.id.split(".")[2]';
    }

    const state = ({
      loggedIn: loggedIn,
      error: null,
      name: name,
      email: email,
      service: 'Amazon',
      data: null,
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
          <button onClick={onSignInAmazon}>Amazon Override</button>
          <br/>
          <button onClick={onSignInMicrosoft} 
            style={{
                'background-image': 'url("https://docs.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_signin_light.png")', 
                'background-size': '100% 100%', 
                display: 'inline-block', 
                padding: '10px 10px', 
                width: '215px', 
                height: '40px', 
                border: 'none'
              }}></button>
          <br/>
          <div style={{height:'5px'}}> </div>
          <GoogleLogin 
            clientId={props.clientID_Google} 
            buttonId="Sign in with Google"
            onSuccess={props.onSignInGoogle}
            onFailure={props.onSignInGoogle}
            cookiePolicy={'single_host_origin'}
            style={{margin: 'ficed', width:'1950px'}}
            theme='dark'
            scope = "https://www.googleapis.com/auth/cloud-billing https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/bigquery"
          />
        </div>
        <br/>
    </div>
  );  
}

export default LoginScreen;
