import React, { Component } from 'react';
// import Safe from "react-safe";
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import MicrosoftLogin from "react-microsoft-login";

import { withAuthenticator, AmplifySignOut, AmplifyAmazonButton } from '@aws-amplify/ui-react'


const CLIENT_ID_GOOGLE = "825269243215-cblac6ek5fl7virhp4ci0puhgvakr83c.apps.googleusercontent.com";
const CLIENT_ID_MICROSOFT = "1854d86b-8e91-4db9-846e-0da965c041d6";


const authHandler = (err, data) => {
    console.log(err, data);
  };

class login extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
          isLogined: false,
          accessToken: ''
        };
    
        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }

    

    login (response) {
        if(response.Zi.access_token){
          this.setState(state => ({
            isLogined: true,
            accessToken: response.Zi.access_token
          }));
        }
      }

      logout (response) {
        this.setState(state => ({
          isLogined: false,
          accessToken: ''
        }));
      }
    
      handleLoginFailure (response) {
        alert('Failed to log in')
      }
    
      handleLogoutFailure (response) {
        alert('Failed to log out')
      }
    
    render() {
        return (
            <div>
                <div id="amazon-root"></div>

                {/* <a href="#" id="LoginWithAmazon">
                    <img border="0" alt="Login with Amazon"
                        src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                        width="156" height="32" />
                </a> */}


                


                {/* <GoogleLogin
                    clientId="825269243215-cblac6ek5fl7virhp4ci0puhgvakr83c.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                /> */}


                { this.state.isLogined ?
                        <GoogleLogout
                        clientId={CLIENT_ID_GOOGLE}
                        buttonText='Logout'
                        onLogoutSuccess={ this.logout }
                        onFailure={ this.handleLogoutFailure }
                        >
                        </GoogleLogout>: <GoogleLogin
                        clientId={CLIENT_ID_GOOGLE}
                        buttonText='Login'
                        onSuccess={ this.login }
                        onFailure={ this.handleLoginFailure }
                        cookiePolicy={ 'single_host_origin' }
                        responseType='code,token'
                        />
                    }

                    <MicrosoftLogin clientId={CLIENT_ID_MICROSOFT} authCallback={authHandler} />

                    <AmplifyAmazonButton />
            </div>

            
        );
    }
}


// function login() {
    
//     componentDidMount() {
//         const script = document.createElement("script");

//         script.script = "";
//     }
//     return (
//     <div>

//         <a href id="LoginWithAmazon">
//             <img border="0" alt="Login with Amazon"
//                 src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
//                 width="156" height="32" />
//         </a>
//     </div>

//   );
// }

export default login;
