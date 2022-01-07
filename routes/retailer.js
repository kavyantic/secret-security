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
const Transaction = mongoose.model('Transaction')

apiURL = "https://www.doopme.com/RechargeAPI/RechargeAPI.aspx?MobileNo=8559948628&APIKey=loUrBAjEvCTxjjYXPYDClRdBY9nXbJoDkbe&REQTYPE=BILLINFO&SERCODE={0}&CUSTNO={1}&REFMOBILENO=9090890989&AMT=0&STV=0&FIELD1=0&FIELD2=[FIELD2]&FIELD3=[FIELD3]&FIELD4=[FIELD4]&FIELD5=[FIELD5]&PCODE=800008&LAT=25.5941&LONG=85.1376&RESPTYPE=JSON"


async function validateCustomerInfo(info){

  
}

router.use((req,res,next)=>{
  if(req.isAuthenticated() && req.user.accountType==="retailer"){
      return next()
  } else {
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&re=retailer/${req.url}`)
      }
      else {
        res.redirect(`/login?msg=Please login again`)
      }
  }
})

router.get('/dashboard',(req,res)=>{

  Transaction.find({type:'FUNDREQUEST','to.name':req.user.username},(err,transactions)=>{
    info = { 
      serviceTime : process.env.serviceTime,
      user:req.user,
      transactions:transactions 
    }
      res.render('retailer/dashboard',{info:info})
    })

})
router.get('/transactions',(req,res)=>{
  Transaction.find({$or:[
    {'to.name':req.user.username},
    {'from.name':req.user.username}
  ]},(err,docs)=>{
    var info = {
      user:req.user,
      title:"My Transactions",
      transactions:docs
    }
    console.log(docs);
    res.render('retailer/transactions',{info:info})
  })
})
router.get('/bills/:billType/submit',(req,res)=>{
    billType = req.params.billType
    msg = req.query.msg
        info = {
          user:req.user,
          billType:billType,
          msg:msg
        }
        res.render('retailer/submitBill',{info:info})
})

router.get('/bills/electricity/new',(req,res)=>{
  ElectricityBill.find({submittedBy:req.user._id},(err,bills)=>{ 
    info = {
      user:req.user,
      bills:bills,
      query:"electiricity",
      title:"Electricity bills"
    }
   res.render('retailer/newBills',{info:info})
  })
})
router.get('/bills/electricity/processing',(req,res)=>{
  ProElecBill.find({submittedBy:req.user._id},(err,bills)=>{
    info = {
      user:req.user,
      bills:bills,
      query:"electricity",
      title:"Electricity bills"
    }
   res.render('retailer/processingBills',{info:info})
  }) 
})
router.get('/balance/request',(req,res)=>{ 
  res.render('retailer/fundRequest')
})
router.get('/fundRequest/cancel/:id',(req,res)=>{
  id = req.params.id
  Transaction.deleteOne({'to.name':req.user.username,id:id},(err)=>{
    if(!err){
      res.redirect('/retailer/dashboard')
    } else {
      res.send(err)
    }
  })
})
router.post('/transactions',(req,res)=>{
  const {toDate,fromDate,type,department,status} = req.body
  query = {$or:[
    {'to.name':req.user.username},
    {'from.name':req.user.username}
  ]}
  if(toDate || fromDate){
    query.date= {}
    toDate?query.date["$lte"] = new Date(req.body.toDate.split("-")).setHours(24):""
    fromDate?query.date["$gte"] = new Date(req.body.fromDate.split("-")).setHours(0, 0, 0, 0):""
  }
  status?query.status = status:""
  department?query.department = department:""
  type?query.type = type:""
  // toName?query["to.name"] = toName:""
  // fromName?query["from.name"] = fromName: ""
  console.log(query);
  Transaction.find(query,
    (err,docs)=>{
    var info = {
      user:req.user,
      type:type,
      status:status,
      department:department,
      title:"Transactions",
      transactions:docs,
      toDate:toDate,
      fromDate:fromDate,
    }
    res.render('retailer/transactions',{info:info})
  })
})
router.post('/balance/request',(req,res)=>{
  const {to,amount,narration} = req.body
  transaction = new Transaction({
    type:"FUNDREQUEST",
    status:"PENDING",
    department:"SELF",
    narration:narration,
    amount:amount,
    to:{
      accountType:req.user.accountType,
      name:req.user.username,
      id:req.user.id
    },
    from:{
      accountType:'admin',
      name:'admin',
      id:req.user.id
    }
  })
  transaction.save((err,saved)=>{
    if(!err){
      res.redirect('/retailer/dashboard')
    }
  })
})
router.post('/bills/electricity/submit',(req,res)=>{
  console.log(req.body);  
  let time = new Date()
  h = String(time.getHours())
  m = String(time.getMinutes())
  currentTime = (h.length==2?h:"0"+h)+":"+(m.length==2?m:"0"+m)
  if(process.env.serviceTime>currentTime){
    const {customerName,kno,state,department} = req.body
    fetch(format(apiURL,department,kno)) 
    .then((apiResponse)=>apiResponse.text())
    .then(billInfo=>JSON.parse(billInfo))
    .then(billInfo=>{
      console.log(billInfo);
      if(billInfo.STATUSCODE==0){
        if(Number(billInfo.BILLAMT)>Number(req.user.balance)){
          res.redirect(`/retailer/bills/electricity/submit?msg=${"You dont have enough balance"}`)
        } else {
          customer = new ElectricityBill({
            submittedBy:req.user._id,
            submittedByName:req.user.username,
            customerName:billInfo.CUSTNAME,
            kno:kno,
            state:state,
            department:department,
            amount:billInfo.BILLAMT,
            billDueDate:billInfo.BILLDUEDATE
          })
          customer.save((err,savedCustomer)=>{
            if(err){
              res.redirect(`/retailer/bills/electricity/submit?msg=${err}`)
              console.log(err);
            }
            else{
              transaction = new Transaction({
                type:'BILLUPLOAD',
                department:department,
                customerNo:kno,
                amount:billInfo.BILLAMT,
                from:{
                  accountType:req.user.accountType,
                  id:req.user._id,
                  name:req.user.username
                },
                to:{
                  accountType:'electricity',
                  name:"bill"
                }
              })
              transaction.save(err=>{console.log(err);})
              console.log(savedCustomer);
              User.updateOne({_id:req.user._id},
                {"$push":{'myBills.electricity':savedCustomer.id},"$inc":{"balance":-Math.abs(billInfo.BILLAMT)}},
                {},
                (err,updatedRetailer)=>{
                    if(err){
                      console.log(err);
                    }else {
                      res.redirect('/retailer/bills/electricity/new')
                    }
                })
            }
          })
        }
  
      }  else {
        res.redirect(`/retailer/bills/electricity/submit?msg=${billInfo.STATUSMSG}`)
      }
      
    }) 
  } else {
    res.redirect(`/retailer/bills/electricity/submit?msg=${"Service has been closed"}`)
  }
    
 
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
      
module.exports = router