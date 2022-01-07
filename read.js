//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
const app = express()
app.use(bodyparser.urlencoded({extended:true}));

app.get('/data',(req,res)=>{
    res.json({
        STATUSCODE: '0',
        STATUSMSG: 'Success',
        BILLNO: '33012402091311',
        CUSTNAME: 'Bakadar',
        BILLDATE: '02-01-2022',
        BILLDUEDATE: '15-01-2022',
        PARTIALPAYALLOW: 'NO',
        BILLAMT: 969
      })
})
PORT = 5000
app.listen(PORT,function(){
  console.log('server started on port '+PORT);
})
