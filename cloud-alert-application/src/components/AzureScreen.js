import React from 'react';

function AzureScreen(props) {
    let json_data_billingAccounts = [];
    let json_data_projects = [];
    console.log(props.data.data);
    if (props.data.service == 'Google' & props.data.data != ''){
        for (let i = 0; i < props.data.data.length; i++) {
            json_data_billingAccounts.push(<h2>Billing Account Display Name: {props.data.data[i].displayName}</h2>);
            json_data_billingAccounts.push(<h2>Billing Account Name: {props.data.data[i].name}</h2>);
            // json_data.push(<h2>Project Name: {props.data.data[i].name}</h2>);
            // json_data.push(<h3>Project ID: {props.data.data[i].projectId}</h3>);
            // json_data.push(<h3>Billing Account: {props.data.data[i].billingAccountName}</h3>);
            json_data_billingAccounts.push(<br/>);


            // json_data_projects.push(<h3>There are no projects associated with this billing account</h3>);
            
            
            // const requestOptions = {
            //     method: 'GET',
            //     headers: {'Authorization': props.data.bearerToken}
            // };
            // let url = 'https://cloudbilling.googleapis.com/v1/' + props.data.data[i].name + '/projects';
            // // let url = 'https://billingbudgets.googleapis.com/v1beta1/' + project_id + '/budgets';
            // console.log(url);
            // fetch(url, requestOptions)
            //     .then(async response => {
            //         const data = await response.json();
            //         console.log('second google api call')
            //         for (let n = 0; n < data.projectBillingInfo.length; n++){
            //             json_data_projects.push(<h3>Project Name: {data.projectBillingInfo[i].name}</h3>);
            //             json_data_projects.push(<h4>Project ID: {data.projectBillingInfo[i].projectId}</h4>);
            //             json_data_projects.push(<br/>)
            //             console.log(data.projectBillingInfo[0].name);
            //         }
            //         if (data.projectBillingInfo.length == 0) {
            //             json_data_projects.push(<h3>There are no projects associated with this billing account</h3>);
            //         }

            // });
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