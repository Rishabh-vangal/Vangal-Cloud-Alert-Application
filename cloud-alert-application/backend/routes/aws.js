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
    accessKeyId: 'AKIAIOZSLPXFVGFVBD6A',
    secretAccessKey: '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',
    region: 'us-east-1',
  });

  async function unzip(data){
    const {gzip, ungzip} = require('node-gzip');
    return await ungzip(data);
  }

  s3.getObject({ Bucket: 'vangal-aws-billing', Key: '/report-0/20200801-20200901/report-0-00001.csv.gz' }, function(err, data)
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

            console.log(table.length);
            console.log(table[0].length);
            console.log(header.length);

            // console.log(dates);

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
                        console.log(time);
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
              console.log('Complete');
              console.log(table.length);              
          });
      }
  });
});

module.exports = router;