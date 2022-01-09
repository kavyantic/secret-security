// jshint esversion:6
require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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


app.get('/res',(req,res)=>{
  fetch("https://www.billdesk.com/pgidsk/pgmerc/jvvnljp/JVVNLJPConfirm.jsp", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "BIGipServerBD_COM_IPv6_Https=!6ZTWbwpSsBiUSptHAqIFxxKfDsMaRSNRuN5xUNuzqgwAzk1ZyZv2jqHKkmDwYZMVrbGPRWB/+e3MoA==; JSESSIONID=0000SqD_h5P_Y1mkTF4OQr4qQqs:1a7ou2k7d; TS0176e7e4=01eb63c7307e0b6eceabf0de8aa332be5c6ff0e868a9fcaf843fd9c3d2c164558726c4210b6d73cef5e822f03b57dd3c3e9413e225e1095043b855f0be203b180a74886469fda4512d1d5a17c022c3479a67cffd5e",
      "Referer": "https://www.billdesk.com/pgidsk/pgmerc/jvvnljp/JVVNLJPDetails.jsp",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "service=BILL&txtCustomerID=210811042609&txtEmail=aba%40gmail.com&billerid=RVVNLJP",
    "method": "POST"
  }).then(r=>{
    console.log(r);
  })
})





PORT = 5000
app.listen(PORT,function(){
  console.log('server started on port '+PORT);
})