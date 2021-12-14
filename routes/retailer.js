const format = require('string-format')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const  {
  Retailer,
  RetailerInfo,
  DistributorInfo,
  AdminInfo,
  CustomerInfo
} = require('../mongooseSchema')

apiURL = "https://www.doopme.com/RechargeAPI/RechargeAPI.aspx?MobileNo=8559948628&APIKey=loUrBAjEvCTxjjYXPYDClRdBY9nXbJoDkbe&REQTYPE=BILLINFO&SERCODE={0}&CUSTNO={1}&REFMOBILENO=9090890989&AMT=0&STV=0&FIELD1=0&FIELD2=[FIELD2]&FIELD3=[FIELD3]&FIELD4=[FIELD4]&FIELD5=[FIELD5]&PCODE=800008&LAT=25.5941&LONG=85.1376&RESPTYPE=JSON"


module.exports = function(app,passport){

 app.get('/dashboard/retailer/',(req,res)=>{
        if(req.isAuthenticated() && req.user.accountType==2){
          res.render('dashboard-retailer')
        }
        else {
          res.redirect('/login')
      
        }
      })
      
      




 app.post('/login/retailer/',(req,res)=>{
        const {username,password}= req.body
        RetailerInfo.findOne({username:username},(err,foundRetailer)=>{
          if(err || foundRetailer == null){
            res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
          }
          else {
            const retailer = new Retailer({
                username:username,
                password:password,
                accountType:3
              })
            req.login(retailer,(err)=>{
              if(err){
                console.log(err);
                res.redirect('/register',{msg:err})
              } else {
                passport.authenticate("local ")(req,res,function(){
                  res.redirect('/dashboard/retailer/')
                })
              }
            })
          }
        })
      }) 



app.post('/register/retailer',function(req,res){
        const {username, password, email, phone, distributor} = req.body
        DistributorInfo.findOne({username:distributor},(err,foundDistributor)=>{
          if(err || foundDistributor==null){
            console.log(err);
            res.redirect(`/register?query=${err?err.message:"No distributor found with this name"}`)
          }
          else {
            console.log(foundDistributor);
            var retailerInfo = new RetailerInfo({
              username:username,
              email:email,
              phone:phone,
              distributor:foundDistributor.id,
              billSubmitted:[]
            })
            retailerInfo.validate((err)=>{
              if(err){
                console.log("validation error");
                res.redirect(`/register?query=${err}`)
              } else {
                Retailer.register({username:username,accountType:"2"},password,(err)=>{
                  if(err){
                    console.log(err);
                    res.redirect(`/register?query=${err.message}`)
                  }
                  else {
                    retailerInfo.save((err,doc)=>{
                      foundDistributor.retailers.push(doc.id)
                      foundDistributor.save()
                      if(err){
                        console.log(err);
                        res.render('register',{msg:err})
                      } else {
                              passport.authenticate('local')(req,res,()=>{
                                res.redirect('/dashboard/retailer/')
                            })
                        }
                     })
                   }
                 })
              }
            })
          }
        })
      })


////////////////////////////////         API            ////////////////////////////////////////


app.post('/retailer/submit/',(req,res)=>{
        const {customerName,kno,state,department} = req.body
        if(req.isAuthenticated()){
          validateCustomerInfo(req.body).then((err)=>{
            if(err){
              res.send(err)
            } else {
              fetch(format(apiURL,department,kno)).then((apiResponse)=>apiResponse.text()).then(billInfo=>JSON.parse(billInfo)).then(billInfo=>{
                  console.log(billInfo);
                  customer = new CustomerInfo({
                    ref:req.user._id,
                    kno:kno,
                    state:state,
                    department:department,
                    amount:billInfo.BILLAMT,
                    billDueDate:billInfo.BILLDUEDATE
                  })
                  console.log("done");
                  customer.save((err)=>{
                    if(err){
                      res.send(err)
                    }
                    else{
                      res.send(customer)
                    }
                  })
                })
              } 
          })
        }
        else {
          res.send('not authenticated')
        }
      })






}