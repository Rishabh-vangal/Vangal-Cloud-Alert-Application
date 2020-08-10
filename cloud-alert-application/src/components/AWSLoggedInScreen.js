import React from 'react';
import './../style/LoggedInScreen.css';


class AWSScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.data.data);

        this.state = {
            props: props,
            json_data: JSON.stringify(props.data.data),
            state: 'billing accounts',
        }

        if (!props.data.data) {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }
    }

    render() {  
        return (
            <div>
                <h1>Welcome {this.props.data.name}</h1>
                <h2>You're logged in with {this.props.data.service}</h2>
                <br/>
                {this.state.json_data}
            </div>
        );
    }
}

export default AWSScreen;