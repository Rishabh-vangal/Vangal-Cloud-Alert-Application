import React from 'react';
import axios from 'axios';
import './../style/LoggedInScreen.css';


class AWSScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            props: props,
            json_data: [],
            state: 'billing accounts',
            timeframe: '',
            billing_services: [], 
            accessKeyId: '', 
            secretAccessKey: '',
            bucketName: '',
            reportName: ''
        }

        this.state.billing_services.push(<button onClick={() => this.GetBillingByService('All')}>All</button>);

        if (!props.data.data) {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }

        this.SwitchBillingDataTimeframe = this.SwitchBillingDataTimeframe.bind(this);
        this.GetBillingByService = this.GetBillingByService.bind(this);
        this.handleAWSKeyChange = this.handleAWSKeyChange.bind(this);
    }

    GetBillingByService(newService){
        if (newService == 'All'){
            this.SwitchBillingDataTimeframe(this.state.billing_data_timeframe);
            return;
        }

        this.state.json_data = [];

        const requestOptions = {
            frequency: this.state.timeframe,
            service: newService,
            accessKeyId: this.state.accessKeyId,
            secretAccessKey: this.state.secretAccessKey,
            bucketName: this.state.bucketName,
            reportName: this.state.reportName
        };

        axios.post('https://vangalcloudalertbackend.tk/AWS/BillingDataByService', requestOptions)
        .then(async response => {
            const dataArray = response.data;

            for (let j = 0; j < dataArray.length; j++){
                let rows = [];
                for (let i = 0; i < dataArray[j].length; i++){
                    let row = [];
                    for (let n = 0; n < dataArray[j][i].length; n++){
                        row.push(<td>{dataArray[j][i][n]}</td>);
                    }
                    rows.push(<tr>{row}</tr>);
                }
                this.state.json_data.push(<table><tbody>{rows}</tbody></table>);
                this.state.json_data.push(<br/>);
                this.state.json_data.push(<br/>);
                this.state.json_data.push(<br/>);
            }
            this.setState(this.state);
            console.log('by service');
        });    
    }

    SwitchBillingDataTimeframe(newTimeframe){
        this.state.json_data = [];
        this.state.timeframe = newTimeframe;

        const requestOptions = {
            frequency: newTimeframe,
            accessKeyId: this.state.accessKeyId,
            secretAccessKey: this.state.secretAccessKey,
            bucketName: this.state.bucketName,
            reportName: this.state.reportName
        };

        axios.post('https://vangalcloudalertbackend.tk/AWS/BillingData', requestOptions)
        .then(async response => {
            const dataArray = response.data;

            for (let j = 0; j < dataArray.length; j++){
                let rows = [];
                for (let i = 0; i < dataArray[j].length; i++){
                    let row = [];
                    for (let n = 0; n < dataArray[j][i].length; n++){
                        row.push(<td>{dataArray[j][i][n]}</td>);
                    }
                    rows.push(<tr>{row}</tr>);
                }
                this.state.json_data.push(<table><tbody>{rows}</tbody></table>);
                this.state.json_data.push(<br/>);
                this.state.json_data.push(<br/>);
                this.state.json_data.push(<br/>);
            }
            if (this.state.billing_services.length == 1){
                this.state.billing_services = [];
                axios.post('https://vangalcloudalertbackend.tk/AWS/BillingServices', requestOptions)
                    .then(async response => {
                        const data = response.data;

                        for (let i = 0; i < data.length; i++){
                            this.state.billing_services.push(<button onClick={() => this.GetBillingByService(data[i])}>{data[i]}</button>);
                        }
                        this.state.billing_services.push(<button onClick={() => this.GetBillingByService('All')}>All</button>);
                        this.setState(this.state);
                    });
            }
            else{
                this.setState(this.state);
            }
        });    
    }

    handleAWSKeyChange(key, type){
        if (type == 'accessKeyId'){
            this.state.accessKeyId = key;
        }
        else if (type == 'secretAccessKey'){
            this.state.secretAccessKey = key;
        }
        else if (type == 'bucketName'){
            this.state.bucketName = key;
        }
        else if (type == 'reportName'){
            this.state.reportName = key;
        }

        console.log(this.state.accessKeyId);
        console.log(this.state.secretAccessKey);
    }

    render() {  
        return (
            <div>
                <h1>Welcome</h1>
                <h2>You're logged in with {this.props.data.service}</h2>
                <br/>
                <br/>
                AWS accessKeyId:
                <input type="text" onChange={e => this.handleAWSKeyChange(e.target.value, 'accessKeyId')}/>
                <br/>
                AWS secretAccessKey:
                <input type="text" onChange={e => this.handleAWSKeyChange(e.target.value, 'secretAccessKey')}/>
                <br/>
                Bucket Name:
                <input type="text" onChange={e => this.handleAWSKeyChange(e.target.value, 'bucketName')}/>
                <br/>
                Report Name:
                <input type="text" onChange={e => this.handleAWSKeyChange(e.target.value, 'reportName')}/>
                <br/>
                <br/>
                <br/>
                <br/>
                If you do not already have Cost and Usage Reports Setup with your AWS account, go to: <a href="https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html">https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html</a> and follow the steps to create Usage reporsts to an S3 Buket.
                <br/>
                <br/>
                <br/>
                Services: {this.state.billing_services}
                <br/>
                <button onClick={() => this.SwitchBillingDataTimeframe('day')}>Day</button>
                <button onClick={() => this.SwitchBillingDataTimeframe('week')}>Week</button>
                <button onClick={() => this.SwitchBillingDataTimeframe('month')}>Month</button>
                <button onClick={() => this.SwitchBillingDataTimeframe('year')}>Year</button>
                <br/>
                {this.state.json_data}
            </div>
        );
    }
}

export default AWSScreen;