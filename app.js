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

dbUrl = "mongodb+srv://rahulkavya9610:painter05@cluster0.afuye.mongodb.net/rechargePortal?retryWrites=true&w=majority"
dbUrlLocal= "mongodb://localhost:27017/rechargePortal"

mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex',true)

const app = express()
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
  secret:"ourSecret",
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
} = require('./mongooseSchema');
const retailer = require('./routes/retailer');


passport.use(Retailer.createStrategy());
passport.serializeUser((user, done)=> {done(null, user);});
passport.deserializeUser((user, done)=>{
  done(null, user); 
});


admin = {
  username:"admin",
  password:"12345678",
  accountType:0
}

// try{

//   admin = new Retailer(admin)
//   admin.save()
//   adminInfo = new AdminInfo(admin)
//   adminInfo.save()
// }
// catch{
// console.log("already created");
// }
 


app.get('/',(req,res)=>{
  res.redirect('/login')
})

app.get('/register',(req,res)=>{
  res.render('register',{msg:req.query.query})

})

app.get('/login',(req,res)=>{
  res.render('login')
})

app.patch('/admin/distributor/set/:username/',(req,res)=>{
  const {username:distributor,field,value} = req.params
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
        DistributorInfo.updateOne({username:distributor}, {$set:req.body}, {new:true}, (error, doc) => {
          if(err){
            console.log(err);
            res.send(err)
          }
          else {
            console.log(doc);
            res.send(doc)
          }
        });;
     }
    })
   }
   else {
       res.redirect('/login')
   }

})






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


app.listen(process.env.PORT || 3000,function(){
  console.log('server started on port '+process.env.PORT);
})
