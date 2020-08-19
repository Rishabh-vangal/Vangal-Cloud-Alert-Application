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
            billing_services: []
        }

        this.state.billing_services.push(<button onClick={() => this.GetBillingByService('All')}>All</button>);

        if (!props.data.data) {
            this.state.json_data.push(<h3>No Billing Accounts associated with this account</h3>);
        }

        this.SwitchBillingDataTimeframe = this.SwitchBillingDataTimeframe.bind(this);
        this.GetBillingByService = this.GetBillingByService.bind(this);
    }

    GetBillingByService(newService){
        console.log(newService);
        if (newService == 'All'){
            this.SwitchBillingDataTimeframe(this.state.billing_data_timeframe);
            return;
        }

        this.state.json_data = [];

        const requestOptions = {
            frequency: this.state.timeframe,
            service: newService
        };

        axios.post('http://localhost:8080/AWS/BillingDataByService', requestOptions)
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
            frequency: newTimeframe
        };

        axios.post('http://localhost:8080/AWS/BillingData', requestOptions)
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
                axios.post('http://localhost:8080/AWS/BillingServices', requestOptions)
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

    render() {  
        return (
            <div>
                <h1>Welcome {this.props.data.name}</h1>
                <h2>You're logged in with {this.props.data.service}</h2>
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