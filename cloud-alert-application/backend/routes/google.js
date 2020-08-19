const axios = require('axios');
const router = require('express').Router();

GoogleData = [];

router.route('/').get((req, res) => {
    res.send('Hey There');
});

/**
 * required reqest body parameters:
 * bearerToken 
 * projectId
 * dastasetId
 * tableId
 * frequency: (day, week, month, year)
 */
router.route('/BillingDataByTime').post((req, res) => {
    // console.log(req.body);
    // console.log(req.headers);

    let table = [];
    
    const requestOptions = {
        method: 'GET',
        headers: {'Authorization': req.body.bearerToken}
    };

    axios.get('https://bigquery.googleapis.com/bigquery/v2/projects/' + req.body.projectId + '/datasets/' + req.body.datasetId + '/tables/' + req.body.tableId, requestOptions)
        .then(async response => {
            const tableHeaders = response.data;
            let row = [];
 
            for (let i = 0; i < tableHeaders.schema.fields.length; i++){
                if (tableHeaders.schema.fields[i].fields){
                    for (let j = 0; j < tableHeaders.schema.fields[i].fields.length; j++){
                        row.push(tableHeaders.schema.fields[i].name + '.' + tableHeaders.schema.fields[i].fields[j].name);
                    }
                }
                else {
                    row.push(tableHeaders.schema.fields[i].name);
                }
            }

            let time;

            let header = row;
            let currTable = [];
            currTable.push(header);         
            table.push(currTable);

            currTable = [];
            currTable.push(header);

            console.log(table.length);
            console.log(table[0].length);
            console.log(header.length);

            axios.get('https://bigquery.googleapis.com/bigquery/v2/projects/' + req.body.projectId + '/datasets/' + req.body.datasetId + '/tables/' + req.body.tableId + '/data', requestOptions)
                .then(async response => {
                    const data = response.data;
                   
                    for (let i = 0; i < data.rows.length; i++){
                        let row = [];
                        for (let j = 0; j < data.rows[i].f.length; j++){
                            if (data.rows[i].f[j].v.f){
                                for (let k = 0; k < data.rows[i].f[j].v.f.length; k++){
                                    row.push(data.rows[i].f[j].v.f[k].v);
                                }
                            }
                            else if (!Array.isArray(data.rows[i].f[j].v)){
                                row.push(data.rows[i].f[j].v);
                            }
                            else {
                                row.push(JSON.stringify(data.rows[i].f[j].v));
                            }
                        }

                        let currStartDate = new Date(row[5] * 1000);
                        let currEndDate = new Date(row[6] * 1000);
                        
                        row[5] = currStartDate + '';
                        row[6] = currEndDate.toString();

                        switch(req.body.frequency){
                            case 'day':
                                if (i == 0){
                                    time = new Date(currStartDate);
                                    time.setHours(0);
                                    time.setMinutes(0);
                                    time.setSeconds(0);
                                    time.setDate(time.getDate() + 1);

                                    console.log(time + '');
                                }
                                while (currStartDate >= time){
                                    time.setDate(time.getDate() + 1);
                                    table.push(currTable);
                                    currTable = [];
                                    currTable.push(header);
                                }
                                currTable.push(row);
                                break;
                            case 'week':
                                if (i == 0){
                                    time = new Date(currStartDate);
                                    time.setDate(time.getDate() - time.getDay() + 7);
                                    time.setHours(0);
                                    time.setMinutes(0);
                                    time.setSeconds(0);
                                }
                                while (currStartDate >= time){
                                    time.setDate(time.getDate() + 7);
                                    table.push(currTable);
                                    currTable = [];
                                    currTable.push(header);
                                }
                                currTable.push(row);
                                break;
                            case 'month':
                                if (i == 0){
                                    time = new Date(currStartDate);
                                    time.setDate(1);
                                    time.setMonth(time.getMonth() + 1);
                                    time.setHours(0);
                                    time.setMinutes(0);
                                    time.setSeconds(0);
                                }
                                while (currStartDate >= time){
                                    time.setMonth(time.getMonth() + 1);
                                    table.push(currTable);
                                    currTable = [];
                                    currTable.push(header);
                                }
                                currTable.push(row);
                                break;
                            default: //year
                                if (i == 0){
                                    time = new Date(currStartDate);
                                    time.setDate(1);
                                    time.setMonth(0);
                                    time.setYear(time.getFullYear() + 1);
                                    time.setHours(0);
                                    time.setMinutes(0);
                                    time.setSeconds(0);
                                }
                                while (currStartDate >= time){
                                    time.setYear(time.getFullYear() + 1);
                                    table.push(currTable);
                                    currTable = [];
                                    currTable.push(header);
                                }
                                currTable.push(row);
                            
                        }                        
                    }        
                    table.push(currTable);          
                    res.send(table);
                    console.log('Complete');
                    console.log(table.length);
                });
        });
});

router.route('/GetCredentialLog').get((req, res) => {
    res.send(GoogleData);
});

router.route('/:id').post((req, res) => {
    console.log(req.params.id);
    GoogleData.push(req.params.id);
    res.send();
});

module.exports = router;