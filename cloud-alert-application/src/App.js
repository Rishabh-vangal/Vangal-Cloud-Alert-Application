import React from 'react';
import LoginScreen from './components/LoginScreen.js';
import AzureScreen from './components/AzureScreen.js';

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

    this.clientID_AWS = 'amzn1.application-oa2-client.58f592dc27c9454ca8c44ef43de17bb1';
    this.clientID_Azure = '1854d86b-8e91-4db9-846e-0da965c041d6';
    this.clientID_Google = '825269243215-cblac6ek5fl7virhp4ci0puhgvakr83c.apps.googleusercontent.com';
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignInGoogle = this.onSignInGoogle.bind(this);
  }

  async componentDidMount() {

  }

  onSignIn = (state) => {
    console.log(state);
    this.setState({
      loggedIn: state.loggedIn,
      error: state.error,
      name: state.name,
      email: state.email,
      service: state.service,
      data: state.data
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
      email: email,
      service: 'Google',
      data: googleUser
    })
    this.onSignIn(state);
  }

  render() {
    if (!this.state.loggedIn){
      // Login Page
      return <LoginScreen onSignIn={this.onSignIn} onSignInGoogle={this.onSignInGoogle} clientID_AWS={this.clientID_AWS} clientID_Azure={this.clientID_Azure} clientID_Google={this.clientID_Google} />
    }
    else {
      switch(this.state.service) {
        case 'AWS':
          break;
        case 'Azure':
          return <AzureScreen data={this.state}/> 
          break;
        case "Google":
          return <AzureScreen data={this.state}/>
          break;
      }
    }
  }
}


export default App;
