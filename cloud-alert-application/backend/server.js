const express = require('express');
const router = require('express').Router();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(router);
app.use(bodyParser.json());

const awsRouter = require('./routes/aws');
const azureRouter = require('./routes/azure');
const googleRouter = require('./routes/google');

app.use('/AWS', awsRouter);
app.use('/Azure', azureRouter);
app.use('/Google', googleRouter);

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(8080, function() {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
    }
   console.log('Running on port 8080'); 
});