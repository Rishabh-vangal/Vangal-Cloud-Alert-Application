const router = require('express').Router();

// helper function for quick sort algorithm
function partition(arr, arrDates, low, high){
  let pivot = arrDates[high];
  let i = low - 1;
  for (let j = low; j < high; j++){
    if (arrDates[j] < pivot){
      i++;

      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;

      temp = arrDates[i];
      arrDates[i] = arrDates[j];
      arrDates[j] = temp;
    }
  }
  let temp = arr[i+1];
  arr[i+1] = arr[high];
  arr[high] = temp;

  temp = arrDates[i+1];
  arrDates[i+1] = arrDates[high];
  arrDates[high] = temp;

  return i+1;
}

//function to sort billing data by time
function sort(arr, arrDates, low, high){
  if (low < high){
    let i = partition(arr, arrDates, low, high);
    sort(arr, arrDates, low, i-1);
    sort(arr, arrDates, i+1, high);
  }
}

/**
 * required reqest body parameters:
 * frequency: (day, week, month, year)
 */
router.route('/BillingData').post((req, res) => {
  var AwsS3 = require ('aws-sdk/clients/s3');
  const s3 = new AwsS3 ({
    accessKeyId: req.body.accessKeyId,
    secretAccessKey: req.body.secretAccessKey,
    region: 'us-east-1',
  });

  async function unzip(data){
    const {gzip, ungzip} = require('node-gzip');
    return await ungzip(data);
  }

  s3.getObject({ Bucket: req.body.bucketName, Key: '/' + req.body.reportName +  '/20200801-20200901/report-0-00001.csv.gz' }, function(err, data)
  {
      if (!err) {
          unzip(data.Body).then((da) => {
            let dataArray = da.toString().split('\n');
            let rows = [];
            let dates = [];
            for (let i = 0; i < dataArray.length; i++){
                let row = [];
                for (let n = 0; n < dataArray[i].split(',').length; n++){
                    row.push(dataArray[i].split(',')[n]);
                }

                try{
                  let t = row[1].split('T')[0].split('-');
                  dates.push(new Date(t[0], parseInt(t[1]) - 1, t[2]));
                }
                catch(err){}
                rows.push(row);
            }
              
            sort(rows, dates, 1, dates.length);

            let time;

            let table = [];

            let header = rows[0];
            let currTable = [];
            currTable.push(header);         
            table.push(currTable);

            currTable = [];
            currTable.push(header);

            for (let i = 2; i < dates.length; i++){
              switch(req.body.frequency){
                case 'day':
                    if (i == 2){
                        time = new Date(dates[i]);
                        time.setDate(time.getDate() + 1);
                    }
                    while (dates[i] >= time){
                        time.setDate(time.getDate() + 1);
                        table.push(currTable);
                        currTable = [];
                        currTable.push(header);
                    }
                    currTable.push(rows[i]);
                    break;
                case 'week':
                    if (i == 2){
                        time = new Date(dates[i]);
                        time.setDate(time.getDate() - time.getDay() + 7);
                    }
                    while (dates[i] >= time){
                        time.setDate(time.getDate() + 7);
                        table.push(currTable);
                        currTable = [];
                        currTable.push(header);
                    }
                    currTable.push(rows[i]);
                    break;
                case 'month':
                    if (i == 2){
                        time = new Date(dates[i]);
                        time.setDate(1);
                        time.setMonth(time.getMonth() + 1);
                    }
                    while (dates[i] >= time){
                        time.setMonth(time.getMonth() + 1);
                        table.push(currTable);
                        currTable = [];
                        currTable.push(header);
                    }
                    currTable.push(rows[i]);
                    break;
                default: //year
                    if (i == 2){
                        time = new Date(dates[i]);
                        time.setDate(1);
                        time.setMonth(0);
                        time.setYear(time.getFullYear() + 1);
                    }
                    while (dates[i] >= time){
                        time.setYear(time.getFullYear() + 1);
                        table.push(currTable);
                        currTable = [];
                        currTable.push(header);
                    }
                    currTable.push(rows[i]);
                
                }                        
              }        
              table.push(currTable);          
              res.send(table);  
          });
      }
  });
});


router.route('/BillingServices').post((req, res) => {
  var AwsS3 = require ('aws-sdk/clients/s3');
  const s3 = new AwsS3 ({
    accessKeyId: req.body.accessKeyId,
    secretAccessKey: req.body.secretAccessKey,
    region: 'us-east-1',
  });

  async function unzip(data){
    const {gzip, ungzip} = require('node-gzip');
    return await ungzip(data);
  }

  s3.getObject({ Bucket: req.body.bucketName, Key: '/report-0/20200801-20200901/report-0-00001.csv.gz' }, function(err, data)
  {
      if (!err) {
          unzip(data.Body).then((da) => {
            let dataArray = da.toString().split('\n');
            services = [];
            for (let i = 1; i < dataArray.length; i++){
                let row = [];
                for (let n = 0; n < dataArray[i].split(',').length; n++){
                    row.push(dataArray[i].split(',')[n]);
                }
                if (row[12] && !services.includes(row[12])){
                  services.push(row[12]);
                }
            }          
            res.send(services);          
          });
      }
  });
});


/**
 * required reqest body parameters:
 * frequency: (day, week, month, year)
 * service: 
 */
router.route('/BillingDataByService').post((req, res) => {
  var AwsS3 = require ('aws-sdk/clients/s3');
  const s3 = new AwsS3 ({
    accessKeyId: req.body.accessKeyId,
    secretAccessKey: req.body.secretAccessKey,
    region: 'us-east-1',
  });

  async function unzip(data){
    const {gzip, ungzip} = require('node-gzip');
    return await ungzip(data);
  }

  s3.getObject({ Bucket: req.body.bucketName, Key: '/report-0/20200801-20200901/report-0-00001.csv.gz' }, function(err, data)
  {
      if (!err) {
          unzip(data.Body).then((da) => {
            let dataArray = da.toString().split('\n');
            let rows = [];
            let dates = [];
            for (let i = 0; i < dataArray.length; i++){
                let row = [];
                for (let n = 0; n < dataArray[i].split(',').length; n++){
                    row.push(dataArray[i].split(',')[n]);
                }

                try{
                  let t = row[1].split('T')[0].split('-');
                  dates.push(new Date(t[0], parseInt(t[1]) - 1, t[2]));
                }
                catch(err){}
                rows.push(row);
            }
              
            sort(rows, dates, 1, dates.length);

            let time;

            let table = [];

            let header = rows[0];
            let currTable = [];
            currTable.push(header);         
            table.push(currTable);

            currTable = [];
            currTable.push(header);
            
            for (let i = 2; i < dates.length; i++){
              if (rows[i][12] == req.body.service){
                switch(req.body.frequency){
                  case 'day':
                      if (i == 2){
                          time = new Date(dates[i]);
                          time.setDate(time.getDate() + 1);
                      }
                      while (dates[i] >= time){
                          time.setDate(time.getDate() + 1);
                          table.push(currTable);
                          currTable = [];
                          currTable.push(header);
                      }
                      currTable.push(rows[i]);
                      break;
                  case 'week':
                      if (i == 2){
                          time = new Date(dates[i]);
                          time.setDate(time.getDate() - time.getDay() + 7);
                      }
                      while (dates[i] >= time){
                          time.setDate(time.getDate() + 7);
                          table.push(currTable);
                          currTable = [];
                          currTable.push(header);
                      }
                      currTable.push(rows[i]);
                      break;
                  case 'month':
                      if (i == 2){
                          time = new Date(dates[i]);
                          time.setDate(1);
                          time.setMonth(time.getMonth() + 1);
                      }
                      while (dates[i] >= time){
                          time.setMonth(time.getMonth() + 1);
                          table.push(currTable);
                          currTable = [];
                          currTable.push(header);
                      }
                      currTable.push(rows[i]);
                      break;
                  default: //year
                      if (i == 2){
                          time = new Date(dates[i]);
                          time.setDate(1);
                          time.setMonth(0);
                          time.setYear(time.getFullYear() + 1);
                      }
                      while (dates[i] >= time){
                          time.setYear(time.getFullYear() + 1);
                          table.push(currTable);
                          currTable = [];
                          currTable.push(header);
                      }
                      currTable.push(rows[i]);
                  
                  }                        
                }        
              }
              table.push(currTable);          
              res.send(table);       
          });
      }
  });
});

module.exports = router;