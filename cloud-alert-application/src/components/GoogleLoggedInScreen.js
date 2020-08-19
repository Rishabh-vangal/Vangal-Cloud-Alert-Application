import React from 'react';
import './../style/LoggedInScreen.css';
import axios from 'axios';


class GoogleScreen extends React.Component {
    constructor(props) {
        super(props);

        let json_data_billingAccounts = [];
        let json_data_datasets = [];

        this.state = {
            props: props,
            json_data: [],
            state: 'projects',
            json_data_datasets: [],
            json_data_billing_data: [],
            json_data_tables: [],
            dataset: '',
            billing_data_timeframe: '',
            billing_services: []
        }

        if (props.data.service == 'Google' & props.data.data != ''){
            if (props.data.data.billingAccounts){
                this.state.json_data.push(<h1>Billing Accounts </h1>);
                for (let i = 0; i < props.data.data.billingAccounts.length; i++) {
                    this.state.json_data.push(<h2>Billing Account Display Name: {props.data.data.billingAccounts[i].displayName}</h2>);
                    this.state.json_data.push(<h2>Billing Account Name: {props.data.data.billingAccounts[i].name}</h2>);
                    this.state.json_data.push(<br/>);
                }
            }
            else {
                this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
            }
            this.state.json_data.push(<br/>);
            this.state.json_data.push(<br/>);
            if (props.data.data.projects){
                this.state.json_data.push(<h1>Projects</h1>);
                for (let i = 0; i < props.data.data.projects.length; i++) {
                    this.state.json_data.push(<h2>Project Name: {props.data.data.projects[i].name}</h2>);
                    this.state.json_data.push(<h2>Project ID: {props.data.data.projects[i].projectId}</h2>);
                    this.state.json_data.push(<h2>Project Number: {props.data.data.projects[i].projectNumber}</h2>);
                    this.state.json_data.push(<button onClick={() => this.GoogleProjectSelected(props.data.data.projects[i].projectId, props.data.bearerToken)}>Get Billing Data For This Project</button>);
                    this.state.json_data.push(<br/>);
                    this.state.json_data.push(<br/>);
                }
            }
            else {
                this.state.json_data.push(<h3>No Projects associated with this account</h3>);
            }
        }
        else {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }

        this.state.billing_services.push(<button onClick={() => this.GetBillingByService('All')}>All</button>);
        
        this.GoogleProjectSelected = this.GoogleProjectSelected.bind(this);
        this.DisplayProjects = this.DisplayProjects.bind(this);
        this.DisplayBillingData = this.DisplayBillingData.bind(this);
        this.DisplayTables = this.DisplayTables.bind(this);
        this.RefreshPage = this.RefreshPage.bind(this);
        this.SwitchBillingDataTimeframe = this.SwitchBillingDataTimeframe.bind(this);
        this.GetBillingByService = this.GetBillingByService.bind(this);
    }

    GoogleProjectSelected(projectId, bearer_token) {
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': bearer_token}
        };
        fetch('https://bigquery.googleapis.com/bigquery/v2/projects/' + projectId + '/datasets', requestOptions)
            .then(async response => {
                const datasets = await response.json();
                if (datasets.datasets){
                    for (let i = 0; i < datasets.datasets.length; i++){
                        this.state.json_data_datasets.push(<h2>Dataset ID: {datasets.datasets[i].id}</h2>);
                        this.state.json_data_datasets.push(<button onClick={() => this.DisplayTables(datasets.datasets[i].id)}>This datasets contains my billing data</button>);
                        this.state.json_data_datasets.push(<br/>);
                    }
                    this.state.json_data_datasets.push(<br/>);
                    this.state.json_data_datasets.push(<button onClick={this.DisplayProjects}>None of these datasets contain my billing data</button>);
                    
                    this.state.state = 'datasets';
                    this.RefreshPage();
                }
                else {
                    // export to BigQuery is not enabled on this project
                    this.state.json_data_datasets.push(<h2>export to BigQuery is not enabled on this project</h2>);
                    this.state.json_data_datasets.push(<button onClick={this.DisplayProjects}>None of these datasets contain my billing data</button>);

                    console.log('export to BigQuery is not enabled on this project');
                    this.state.state = 'datasets';
                    this.RefreshPage();
                }
            })
    }

    DisplayProjects(){
        this.state.state = 'projects';
        this.state.json_data_datasets = [];
        this.state.json_data_billing_data = [];
        this.state.json_data_tables = [];
        this.RefreshPage();
    }

    RefreshPage(){
        this.setState(this.state);
    }

    DisplayTables(dataset){
        let projectId = dataset.split(':')[0];
        let datasetId = dataset.split(':')[1];
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': this.state.props.data.bearerToken}
        };

        fetch('https://bigquery.googleapis.com/bigquery/v2/projects/' + projectId + '/datasets/' + datasetId + '/tables', requestOptions)
            .then(async response => {
                const data = await response.json();
                
                this.state.json_data_tables = [];
                for (let i = 0; i < data.tables.length; i++){
                    this.state.json_data_tables.push(<h2>Table ID: {data.tables[i].tableReference.tableId}</h2>);
                    this.state.json_data_tables.push(<button onClick={() => this.DisplayBillingData(data.tables[i].id)}>This datasets contains my billing data</button>);
                    this.state.json_data_tables.push(<br/>);
                }
                this.state.json_data_tables.push(<br/>);
                this.state.json_data_tables.push(<br/>);
                this.state.json_data_tables.push(<button onClick={this.DisplayProjects}>None of these tables contain my billing data</button>);

                this.state.state = 'tables'
                this.RefreshPage();
        });
    }

    DisplayBillingData(dataset){
        this.state.dataset = dataset;
        this.state.state = 'billing data'
        this.RefreshPage();
    }

    GetBillingByService(newService){
        if (newService == 'All'){
            this.SwitchBillingDataTimeframe(this.state.billing_data_timeframe);
        }

        const requestOptions = {
            bearerToken: this.state.props.data.bearerToken,
            projectId: this.state.dataset.split(':')[0],
            datasetId: this.state.dataset.split(':')[1].split('.')[0],
            tableId: this.state.dataset.split(':')[1].split('.')[1],
            frequency: this.state.billing_data_timeframe,
            service: newService
        };

        axios.post('http://localhost:8080/Google/BillingDataByService', requestOptions)
            .then(async response => {
                const data = response.data;

                this.state.json_data_billing_data = [];
                for (let t = 0; t < data.length; t++){
                    let table = [];

                    for (let i = 0; i < data[t].length; i++){
                        let row = [];
                        for (let n = 0; n < data[t][i].length; n++){
                            row.push(<td>{data[t][i][n]}</td>);
                        }
                        table.push(<tr>{row}</tr>);
                    }
                    this.state.json_data_billing_data.push(<table><tbody>{table}</tbody></table>);
                    this.state.json_data_billing_data.push(<br/>);
                    this.state.json_data_billing_data.push(<br/>);
                    this.state.json_data_billing_data.push(<br/>);
                }
                this.RefreshPage();
            })
    }

    SwitchBillingDataTimeframe(newTimeframe){
        this.state.billing_data_timeframe = newTimeframe;
        
        const requestOptions1 = {
            bearerToken: this.state.props.data.bearerToken,
            projectId: this.state.dataset.split(':')[0],
            datasetId: this.state.dataset.split(':')[1].split('.')[0],
            tableId: this.state.dataset.split(':')[1].split('.')[1],
            frequency: newTimeframe
        };

        axios.post('http://localhost:8080/Google/BillingDataByTime', requestOptions1)
            .then(async response => {
                // const data = await response.json();
                const data = response.data;

                this.state.json_data_billing_data = [];
                for (let t = 0; t < data.length; t++){
                    let table = [];

                    for (let i = 0; i < data[t].length; i++){
                        let row = [];
                        for (let n = 0; n < data[t][i].length; n++){
                            row.push(<td>{data[t][i][n]}</td>);
                        }
                        table.push(<tr>{row}</tr>);
                    }
                    this.state.json_data_billing_data.push(<table><tbody>{table}</tbody></table>);
                    this.state.json_data_billing_data.push(<br/>);
                    this.state.json_data_billing_data.push(<br/>);
                    this.state.json_data_billing_data.push(<br/>);
                }
                if (this.state.billing_services.length == 1){
                    this.state.billing_services = [];
                    axios.post('http://localhost:8080/Google/BillingServices', requestOptions1)
                        .then(async response => {
                            const data = response.data;
                            
                            for (let i = 0; i < data.length; i++){
                                this.state.billing_services.push(<button onClick={() => this.GetBillingByService(data[i])}>{data[i]}</button>);
                            }
                            this.state.billing_services.push(<button onClick={() => this.GetBillingByService('All')}>All</button>);
                            this.RefreshPage();
                        });
                }
                else{
                    this.RefreshPage();
                }
            })
    }

    render() {
        if (this.state.state == 'projects'){   
            return (
                <div>
                    <h1>Welcome {this.state.props.data.name}</h1>
                    <h2>You're logged in with {this.state.props.data.service}</h2>
                    <br/>
                    {this.state.json_data}           
                    
                </div>
            );
        }
        else if (this.state.state == 'datasets'){
            return (
                <div>
                    <h1>Welcome {this.props.data.name}</h1>
                    <h2>You're logged in with {this.props.data.service}</h2>
                    <br/>
                    {this.state.json_data_datasets}
                </div>
            );
        }
        else if (this.state.state == 'tables'){
            return (
                <div>
                    <h1>Welcome {this.props.data.name}</h1>
                    <h2>You're logged in with {this.props.data.service}</h2>
                    <br/>
                    {this.state.json_data_tables}               
                </div>
            );
        }
        else if (this.state.state == 'billing data'){
            return (
                <div>
                    <h1>Welcome {this.props.data.name}</h1>
                    <h2>You're logged in with {this.props.data.service}</h2>
                    <br/>
                    {this.state.json_data_tables}
                    <br/>
                    Services: {this.state.billing_services}
                    <br/>
                    <button onClick={() => this.SwitchBillingDataTimeframe('day')}>Day</button>
                    <button onClick={() => this.SwitchBillingDataTimeframe('week')}>Week</button>
                    <button onClick={() => this.SwitchBillingDataTimeframe('month')}>Month</button>
                    <button onClick={() => this.SwitchBillingDataTimeframe('year')}>Year</button>
                    <br/>
                    {this.state.json_data_billing_data}               
                </div>
            );
        }
    }
}

export default GoogleScreen;