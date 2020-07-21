import React from 'react';
import axios from 'axios';

function AzureScreen(props) {
    let json_data_billingAccounts = [];
    let json_data_projects = [];
    console.log(props.data.data);
    if (props.data.service == 'Google' & props.data.data != ''){
        for (let i = 0; i < props.data.data.length; i++) {
            json_data_billingAccounts.push(<h2>Billing Account Display Name: {props.data.data[i].displayName}</h2>);
            json_data_billingAccounts.push(<h2>Billing Account Name: {props.data.data[i].name}</h2>);
            json_data_billingAccounts.push(<br/>);
        }
    }
    else if (props.data.service == 'Azure' & props.data.data != ''){
        console.log(props.data.data);
        for (let i = 0; i < props.data.data.length; i++){
            json_data_billingAccounts.push(<h2>Billing Account Name: {props.data.data[i].name}</h2>);
            json_data_billingAccounts.push(<h2>Billing Account ID: {props.data.data[i].id}</h2>);
            json_data_billingAccounts.push(<br/>);
        }
    }
    else {
        json_data_billingAccounts.push(<h3>No Billing Accounts associated with this account</h3>);
    }

    return (
        <div>
            <h1>Welcome {props.data.name}</h1>
            <h2>You're logged in with {props.data.service}</h2>
            <br/>
            {json_data_billingAccounts}           
            
        </div>
    );
}

export default AzureScreen;