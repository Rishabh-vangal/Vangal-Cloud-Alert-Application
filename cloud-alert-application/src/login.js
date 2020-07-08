import React, { Component } from 'react';
import Safe from "react-safe";
import GoogleLogin from 'react-google-login';


const responseGoogle = (response) => {
    console.log(response);
}


class login extends Component {
    
    // contructor(props) {
    //     super(props)
    //     this.state = {
    //         isSignedIn: false,
    //     }
    // }
    

    componentDidMount() {
    
        const script = document.createElement("script");
        script.src = "loginscriptA.js";
        script.async = true;
        document.body.appendChild(script);

        const script2 = document.createElement("script");
        script2.src = "loginscriptB.js";
        script2.async = true;
        document.body.appendChild(script2);
    }

    getContent() {
        if (this.state.isSignedIn) {
          return <p>hello user, you're signed in </p>
        } else {
          return (
            <div>
              <p>You are not signed in. Click here to sign in.</p>
              <button id="loginButton">Login with Google</button>
            </div>
          )
        }
        
    }

    render() {
        return (
            <div>
                <div id="amazon-root"></div>

                <a href="" id="LoginWithAmazon">
                    <img border="0" alt="Login with Amazon"
                        src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                        width="156" height="32" />
                </a>


                


                <GoogleLogin
                    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
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
