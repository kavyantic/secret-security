const format = require('string-format')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const  {
  Retailer,
  RetailerInfo,
  DistributorInfo,
  AdminInfo,
  CustomerInfo,
  ProcessingCustomerInfo
} = require('../mongooseSchema')

apiURL = "https://www.doopme.com/RechargeAPI/RechargeAPI.aspx?MobileNo=8559948628&APIKey=loUrBAjEvCTxjjYXPYDClRdBY9nXbJoDkbe&REQTYPE=BILLINFO&SERCODE={0}&CUSTNO={1}&REFMOBILENO=9090890989&AMT=0&STV=0&FIELD1=0&FIELD2=[FIELD2]&FIELD3=[FIELD3]&FIELD4=[FIELD4]&FIELD5=[FIELD5]&PCODE=800008&LAT=25.5941&LONG=85.1376&RESPTYPE=JSON"


async function validateCustomerInfo(info){

  
}


module.exports = function(app,passport){

 app.get('/dashboard/retailer/',(req,res)=>{
        if(req.isAuthenticated()){
          RetailerInfo.findOne({username:req.user.username},(err,doc)=>{
            if(err || !doc){
              res.redirect('/login',{msg:err})
            }
            else {
              res.render('retailer/dashboard-retailer',{name:req.user.username})
            }
          })
        }
        else {
          res.redirect('/login')
      
        }
      })
      
      




 app.post('/login/retailer/',(req,res)=>{
        const {username,password}= req.body
        RetailerInfo.findOne({username:username},(err,foundRetailer)=>{
          if(err || !foundRetailer){
            res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
          }
          else {
            const retailer = new Retailer({
                username:username,
                password:password,
                accountType:2
              })
            req.login(retailer,(err)=>{
              if(err){
                console.log(err);
                res.redirect('/register')
              } else {
                passport.authenticate("local ")(req,res,function(){
                  res.redirect('/dashboard/retailer/')
                })
              }
            })
          }
        })
      }) 


app.get('/dashboard/retailer/bills/submit',(req,res)=>{
  if(req.isAuthenticated()){
    RetailerInfo.findOne({username:req.user.username},(err,doc)=>{
      if(err || !doc){
        res.redirect('/login',{msg:err})
      }
      else {
        res.render('retailer/submit-bill',{name:req.user.username})
      }
    })
  }
  else {
    res.redirect('/login')

  }
})

app.post('/retailer/bills/submit',(req,res)=>{
  const {customerName,kno,state,department} = req.body

  if(req.isAuthenticated()){
    RetailerInfo.findOne({username:req.user.username},(err,foundRetailer)=>{
      if(err || !foundRetailer){
        res.redirect('/login',{msg:err})
      }
      else {
        fetch(format(apiURL,department,kno)).then((apiResponse)=>apiResponse.text()).then(billInfo=>JSON.parse(billInfo)).then(billInfo=>{
          console.log(billInfo);
          if(billInfo.STATUSCODE==0){
            customer = new CustomerInfo({
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
      }  
    })
  }
  else {
    res.redirect('/login')

  }
})
      

app.get('/dashboard/retailer/bills/list',(req,res)=>{
        if(req.isAuthenticated()){
          RetailerInfo.findOne({username:req.user.username},(err,foundRetailer)=>{
            if(err || !foundRetailer){
              res.redirect('/login',{msg:err})
            }
            else {
              bills = foundRetailer.billSubmitted
              CustomerInfo.find({serial:{$in:bills}},(err,allBillsInfo)=>{
                console.log(allBillsInfo);
                if(!err && allBillsInfo){
                ProcessingCustomerInfo.find({serial:{$in:bills}},(err,allProcessingBillsInfo)=>{
                  console.log(allProcessingBillsInfo);
                    if(!err && allProcessingBillsInfo){
                      res.render('retailer/my-bills',{bills:allBillsInfo})
                    } else {
                      res.render('retailer/my-bills',{bills:allBillsInfo})
                    }
                })

                }
                else {
                  res.sendStatus(400)
                }

              })
            }
          })
        }
        else {
          res.redirect('/login')
      
        }
      })





}