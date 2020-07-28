import React from 'react';


class AzureScreen extends React.Component {
    constructor(props) {
        super(props);

        let json_data_billingAccounts = [];
        let json_data_projects = [];
        console.log(props.data.data);

        this.state = {
            props: props,
            json_data: [],
            state: 'projects',
            json_data_projects: [],
            json_data_billing_data: []
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
        else if (props.data.service == 'Azure' & props.data.data != ''){
            console.log(props.data.data);
            for (let i = 0; i < props.data.data.length; i++){
                this.state.json_data.push(<h2>Billing Account Name: {props.data.data[i].name}</h2>);
                this.state.json_data.push(<h2>Billing Account ID: {props.data.data[i].id}</h2>);
                this.state.json_data.push(<br/>);
            }
        }
        else {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }
        
        this.GoogleProjectSelected = this.GoogleProjectSelected.bind(this);
        this.DisplayProjects = this.DisplayProjects.bind(this);
        this.DisplayBillingData = this.DisplayBillingData.bind(this);
        this.RefreshPage = this.RefreshPage.bind(this);
    }

    GoogleProjectSelected(projectId, bearer_token) {
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': bearer_token}
        };
        console.log(projectId);
        console.log(bearer_token);
        fetch('https://bigquery.googleapis.com/bigquery/v2/projects/' + projectId + '/datasets', requestOptions)
            .then(async response => {
                const datasets = await response.json();
                console.log(datasets);
                console.log(datasets.datasets);
                if (datasets.datasets){
                    console.log('Choose a database: ');
                    console.log(datasets.datasets);
                    for (let i = 0; i < datasets.datasets.length; i++){
                        this.state.json_data_projects.push(<h2>Dataset ID: {datasets.datasets[i].id}</h2>);
                        this.state.json_data_projects.push(<button onClick={() => this.DisplayBillingData(datasets.datasets[i].id)}>This datasets contains my billing data</button>);
                        this.state.json_data_projects.push(<br/>);
                    }
                    this.state.json_data_projects.push(<br/>);
                    this.state.json_data_projects.push(<button onClick={this.DisplayProjects}>None of these datasets contain my billing data</button>);
                    
                    this.setState({
                        props: this.state.props,
                        json_data: this.state.json_data,
                        state: 'datasets',
                        json_data_projects: this.state.json_data_projects,
                        json_data_billing_data: this.state.json_data_billing_data,
                        json_data_billing_data: this.state.json_data_billing_data
                    });
                    console.log('state', this.state.state);
                }
                else {
                    // export to BigQuery is not enabled on this project
                    this.state.json_data_projects.push(<h2>export to BigQuery is not enabled on this project</h2>);
                    this.state.json_data_projects.push(<button onClick={this.DisplayProjects}>None of these datasets contain my billing data</button>);

                    console.log('export to BigQuery is not enabled on this project');
                    this.state.state = 'datasets';
                    this.RefreshPage();
                }
            })
    }

    DisplayProjects(){
        this.setState({
            props: this.state.props,
            json_data: this.state.json_data,
            state: 'projects',
            json_data_projects: [],
            json_data_billing_data: []
        });
    }

    RefreshPage(){
        this.setState(this.state);
    }

    DisplayBillingData(dataset){
        let projectId = dataset.split(':')[0];
        let datasetId = dataset.split(':')[1];
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': this.state.props.data.bearerToken}
        };

        fetch('https://bigquery.googleapis.com/bigquery/v2/projects/' + projectId + '/datasets/' + datasetId, requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log(data);
                console.log(JSON.stringify(data));
                this.state.json_data_billing_data.push(<h3>{JSON.stringify(data)}</h3>);
                this.state.state = 'billing data'
                this.RefreshPage();
                console.log(this.state.json_data_projects);
            });
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
                    {this.state.json_data_projects}
                </div>
            );
        }
        else if (this.state.state == 'billing data'){
            return (
                <div>
                    <h1>Welcome {this.props.data.name}</h1>
                    <h2>You're logged in with {this.props.data.service}</h2>
                    <br/>
                    {this.state.json_data_projects}
                    {this.state.json_data_billing_data}               
                </div>
            );
        }
    }
}

export default AzureScreen;