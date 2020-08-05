import React from 'react';
import './../style/LoggedInScreen.css';


class AzureScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.data.data);

        this.state = {
            props: props,
            json_data: [],
            state: 'billing accounts',
            json_data_invoices: []
        }

        if (props.data.service == 'Azure' & props.data.data != ''){
            console.log(props.data.data);
            for (let i = 0; i < props.data.data.length; i++){
                this.state.json_data.push(<h2>Billing Account Name: {props.data.data[i].name}</h2>);
                this.state.json_data.push(<h2>Billing Account ID: {props.data.data[i].id}</h2>);
                this.state.json_data.push(<button onClick={() => this.GetInvoices(props.data.data[i].name)}>Get Billing Data for this billing account</button>);
                this.state.json_data.push(<br/>);
            }
        }
        else {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }
        
        this.RefreshPage = this.RefreshPage.bind(this);
        this.GetInvoices = this.GetInvoices.bind(this);
        this.ViewBillingAccounts = this.ViewBillingAccounts.bind(this);
    }

    GetInvoices(projectName){
        console.log(this.props.data.bearerToken);
        console.log(projectName);

        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': this.props.data.bearerToken}
        };

        fetch('https://management.azure.com/providers/Microsoft.Billing/billingAccounts/' + projectName + '/invoices?api-version=2019-10-01-preview&periodStartDate=' + '01-01-2019' + '&periodEndDate=' + '01-01-2020', requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log(data)
                this.state.json_data_invoices = [];
                if (data.code == 'BadRequest'){
                    this.state.json_data_invoices.push(<h3>There are no invoices associated with this billing account</h3>);
                }
                else {
                    this.state.json_data_invoices.push(<h3>{JSON.stringify(data)}</h3>);   
                }
                this.state.json_data_invoices.push(<button onClick={() => this.ViewBillingAccounts()}>View Billing Accounts</button>);

                this.state.state = 'invoices';
                this.RefreshPage();
            });
    }

    ViewBillingAccounts(){
        this.state.state = 'billing accounts';
        this.RefreshPage();
    }

    RefreshPage(){
        this.setState(this.state);
    }

    render() {
        if (this.state.state == 'billing accounts'){   
            return (
                <div>
                    <h1>Welcome {this.state.props.data.name}</h1>
                    <h2>You're logged in with {this.state.props.data.service}</h2>
                    <br/>
                    {this.state.json_data}           
                    
                </div>
            );
        }
        else if (this.state.state == 'invoices'){   
            return (
                <div>
                    <h1>Welcome {this.state.props.data.name}</h1>
                    <h2>You're logged in with {this.state.props.data.service}</h2>
                    <br/>
                    {this.state.json_data_invoices}           
                    
                </div>
            );
        }
    }
}

export default AzureScreen;