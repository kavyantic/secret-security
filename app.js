//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const session = require('express-session');
const passport = require('passport');
const res = require('express/lib/response');
const format = require('string-format')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


mongoose.connect('mongodb://localhost:27017/rechargePortal',{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex',true)

const app = express()
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine','ejs');
require('./routes/admin')(app,passport)
require('./routes/retailer')(app,passport)
require('./routes/distributor')(app,passport)

// var Retailer = mongoose.model('Retailer',retailerSchema)
// var RetailerInfo = mongoose.model('RetailerInfo',retailerInfoSchema)
// var DistributorInfo = mongoose.model('DistributorInfo',distributorInfoSchema)
// var AdminInfo = mongoose.model('AdminInfo',adminInfoSchema)
// var CustomerInfo  = mongoose.model('CustomerInfo',customerInfoSchema)

const  {
  Retailer,
  RetailerInfo,
  DistributorInfo,
  AdminInfo,
  CustomerInfo
} = require('./mongooseSchema')


passport.use(Retailer.createStrategy());
passport.serializeUser((user, done)=> {done(null, user);});
passport.deserializeUser((user, done)=>{
  done(null, user); 
});


async function validateCustomerInfo(info){
  return undefined
}



app.get('/register',(req,res)=>{
  res.render('register',{msg:req.query.query})

})

app.get('/login',(req,res)=>{
  res.render('login')
})




// app.post('/test',(req,res)=>{
//   const kno = req.body.kno
//   const department = req.body.department
//   fetch(format(apiURL,department,kno)).then((billInfo)=>billInfo.text()).then(text=>{
//     console.log(text);
//     res.send(JSON.parse(text))
//   })
// })



app.get('/remove',(req,res)=>{
  Retailer.remove((err)=>{
    console.log(err);
  })
  RetailerInfo.remove((err)=>{
    console.log(err);
  })
  DistributorInfo.remove((err)=>{
    console.log(err);
  })
AdminInfo.remove((err)=>{
    console.log(err);
  })
CustomerInfo.remove((err)=>{
  console.log(err);
})
  res.send("removed")
})


app.listen(3000,function(){
  console.log('server started on port 3000');
})
