const format = require('string-format')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = require('express').Router();
const mongoose = require('mongoose');

const User = mongoose.model('User')
const Retailer = mongoose.model('Retailer')
const ElectricityBill = mongoose.model('ElectricityBill')
const ProElecBill = mongoose.model('ProcessingElectricityBill')
const WaterBill = mongoose.model('WaterBill')
const ProWaterBill = mongoose.model('ProcessingWaterBill')
apiURL = "https://www.doopme.com/RechargeAPI/RechargeAPI.aspx?MobileNo=8559948628&APIKey=loUrBAjEvCTxjjYXPYDClRdBY9nXbJoDkbe&REQTYPE=BILLINFO&SERCODE={0}&CUSTNO={1}&REFMOBILENO=9090890989&AMT=0&STV=0&FIELD1=0&FIELD2=[FIELD2]&FIELD3=[FIELD3]&FIELD4=[FIELD4]&FIELD5=[FIELD5]&PCODE=800008&LAT=25.5941&LONG=85.1376&RESPTYPE=JSON"


async function validateCustomerInfo(info){

  
}

router.use((req,res,next)=>{
  if(req.isAuthenticated() && req.user.accountType==="retailer"){
      return next()
  } else {
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&red=retailer/${req.url}`)
      }
      else {
        res.redirect(`/login?msg=Please login again`)
      }
  }
  
})
router.get('/dashboard',(req,res)=>{
     Retailer.findOne({username:req.user.username},(err,foundRetailer)=>{
       info = {
         user:foundRetailer
       }
      res.render('retailer/dashboard',{info:info})
     })
})
router.get('/bills/:billType/submit',(req,res)=>{
    billType = req.params.billType
    Retailer.findOne({username:req.user.username},(err,foundRetailer)=>{
        info = {
          user:foundRetailer,
          billType:billType
        }
        res.render('retailer/submitBill',{info:info})
    })
})
router.post('/bills/electricity/submit',(req,res)=>{
  const {customerName,kno,state,department} = req.body
  fetch(format(apiURL,department,kno))
  .then((apiResponse)=>apiResponse.text())
  .then(billInfo=>JSON.parse(billInfo))
  .then(billInfo=>{
    console.log(billInfo);
    if(billInfo.STATUSCODE==0){
      customer = new ElectricityBill({
        submittedBy:req.user._id,
        submittedByName:req.user.username,
        customerName:customerName,
        kno:kno,
        state:state,
        department:department,
        amount:billInfo.BILLAMT,
        billDueDate:billInfo.BILLDUEDATE
      })
      customer.save((err,savedCustomer)=>{
        if(err){
          res.send(err)
          console.log(err);
        }
        else{
          console.log(savedCustomer);
          Retailer.findByIdAndUpdate(req.user._id,
            {"$push":{'billSubmitted':savedCustomer._id}},
            { "new": true, "upsert": true },
            (err,updatedRetailer)=>{
                if(err){
                  console.log(err);
                }else {
                  res.send(savedCustomer)
                }
            })
        }
      })
    }  else {
      res.send(billInfo.STATUSMSG)
    }
    
  })    
 
})
      

router.post('/bills/water/submit',(req,res)=>{
  const {customerName,kno,state,department} = req.body
  fetch(format(apiURL,department,kno))
  .then((apiResponse)=>apiResponse.text())
  .then(billInfo=>JSON.parse(billInfo))
  .then(billInfo=>{
    console.log(billInfo);
    if(billInfo.STATUSCODE==0){
      customer = new ElectricityBill({
        submittedBy:req.user.username,
        customerName:customerName,
        kno:kno,
        state:state,
        department:department,
        amount:billInfo.BILLAMT,
        billDueDate:billInfo.BILLDUEDATE
      })
      customer.save((err,savedCustomer)=>{
        if(err){
          res.send(err)
        }
        else{
          foundRetailer.billSubmitted.push(savedCustomer.serial)
          foundRetailer.save(err=>{
            if(err){
              console.log(err);
            }else {
              res.send(customer)
            }
          })
        }
      })
    }  else {
      res.send(billInfo.STATUSMSG)
    }
    
  })    
 
})
      

// app.get('/dashboard/retailer/bills/list',(req,res)=>{
//         if(req.isAuthenticated()){
//           RetailerInfo.findOne({username:req.user.username},(err,foundRetailer)=>{
//             if(err || !foundRetailer){
//               res.redirect('/login',{msg:err})
//             }
//             else {
//               bills = foundRetailer.billSubmitted
//               CustomerInfo.find({serial:{$in:bills}},(err,allBillsInfo)=>{
//                 console.log(allBillsInfo);
//                 if(!err && allBillsInfo){
//                 ProcessingCustomerInfo.find({serial:{$in:bills}},(err,allProcessingBillsInfo)=>{
//                   console.log(allProcessingBillsInfo);
//                     if(!err && allProcessingBillsInfo){
//                       res.render('retailer/my-bills',{bills:allBillsInfo})
//                     } else {
//                       res.render('retailer/my-bills',{bills:allBillsInfo})
//                     }
//                 })

//                 }
//                 else {
//                   res.sendStatus(400)
//                 }

//               })
//             }
//           })
//         }
//         else {
//           res.redirect('/login')
      
//         }
//       })





module.exports = router