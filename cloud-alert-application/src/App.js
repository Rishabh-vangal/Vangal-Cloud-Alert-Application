import React from 'react';
import LoginScreen from './components/LoginScreen.js';
// const {google} = require('googleapis');
// const cloudbilling = google.cloudbilling('v1');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      error: '',
      name: '',
      email: '',
      service: ''
    }

    // async function main () {
    //   const authClient = await authorize();
    //   const request = {
    //     // Required. The resource name of the billing account associated with the projects that
    //     // you want to list. For example, `billingAccounts/012345-567890-ABCDEF`.
    //     name: 'billingAccounts/my-billing-account',  // TODO: Update placeholder value.
    
    //     auth: authClient,
    //   };
    
    //   let response;
    //   do {
    //     if (response && response.nextPageToken) {
    //       request.pageToken = response.nextPageToken;
    //     }
    //     response = (await cloudbilling.billingAccounts.projects.list(request)).data;
    //     const projectBillingInfoPage = response.projectBillingInfo;
    //     if (projectBillingInfoPage) {
    //       for (let i = 0; i < projectBillingInfoPage.length; i++) {
    //         // TODO: Change code below to process each resource in `projectBillingInfoPage`:
    //         console.log(JSON.stringify(projectBillingInfoPage[i], null, 2));
    //       }
    //     }
    //   } while (response.nextPageToken);
    // }
    // main();
    
    // async function authorize() {
    //   const auth = new google.auth.GoogleAuth({
    //     scopes: ['https://www.googleapis.com/auth/cloud-platform']
    //   });
    //   return await auth.getClient();
    // }

    this.clientID_AWS = 'amzn1.application-oa2-client.58f592dc27c9454ca8c44ef43de17bb1';
    this.clientID_Azure = '1854d86b-8e91-4db9-846e-0da965c041d6';
    this.clientID_Google = '825269243215-cblac6ek5fl7virhp4ci0puhgvakr83c.apps.googleusercontent.com';
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignInGoogle = this.onSignInGoogle.bind(this);
  }

  async componentDidMount() {
    const url = "";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

  }

  onSignIn = (state) => {
    console.log(state);
    this.setState({
      loggedIn: state.loggedIn,
      error: state.error,
      name: state.name,
      email: state.email,
      service: state.service
    })
  }

  onSignInGoogle(googleUser){
    console.log(googleUser);
    const profile = googleUser.getBasicProfile();
    const name = profile.getName();
    const email = profile.getEmail();


    const state = ({
      loggedIn: true,
      error: '',
      name: name,
      email: email
    })
    this.onSignIn(state);
  }

  render() {
    if (!this.state.loggedIn){
      // Login Page
      return <LoginScreen onSignIn={this.onSignIn} onSignInGoogle={this.onSignInGoogle} clientID_AWS={this.clientID_AWS} clientID_Azure={this.clientID_Azure} clientID_Google={this.clientID_Google} />
    }
    else {
      return <h1> You're logged in </h1>
    }
  }
}


export default App;
