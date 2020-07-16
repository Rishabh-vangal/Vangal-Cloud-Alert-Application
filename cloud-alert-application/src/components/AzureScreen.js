import React from 'react';

function AzureScreen(props) {
    let json_data = [];
    console.log(props.data.data);
    if (props.data.service == 'Google' & props.data.data != ''){
        for (let i = 0; i < props.data.data.length; i++) {
            json_data.push(<h2>Project Name: {props.data.data[i].name}</h2>);
            json_data.push(<h3>Project ID: {props.data.data[i].projectId}</h3>);
            json_data.push(<h3>Billing Account: {props.data.data[i].billingAccountName}</h3>);
            json_data.push(<br/>);
        }
    }
    else {
        json_data.push(<h3>No Billing Accounts associated with this account</h3>);
    }


    return (
        <div>
            <h1>Welcome {props.data.name}</h1>
            <h2>You're logged in with {props.data.service}</h2>
            <br/>
            {json_data}
            
            
        </div>
    );
}

export default AzureScreen;