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

// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('./mongooseSchema')
apiURL = "https://www.doopme.com/RechargeAPI/RechargeAPI.aspx?MobileNo=8559948628&APIKey=loUrBAjEvCTxjjYXPYDClRdBY9nXbJoDkbe&REQTYPE=BILLINFO&SERCODE=JVVNL&CUSTNO={}&REFMOBILENO=9090890989&AMT=0&STV=0&FIELD1=0&FIELD2=[FIELD2]&FIELD3=[FIELD3]&FIELD4=[FIELD4]&FIELD5=[FIELD5]&PCODE=800008&LAT=25.5941&LONG=85.1376&RESPTYPE=JSON"
console.log(format(apiURL,"lowda"))
mongoose.connect('mongodb://localhost:27017/rechargePortal',{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex',true)

const app = express()
const router = express.Router({ mergeParams: true });

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


// passport.use(new GoogleStrategy({
//   clientID:     process.env.GOOGLE_CLIENT_ID  ,
//   clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/auth/google/callback",
//   passReqToCallback   : true
// }, (request, accessToken, refreshToken, profile, done) => {
//   return done(null, profile);
// })
// );
const Retailer = mongoose.model('Retailer',retailerSchema)
const RetailerInfo = mongoose.model('RetailerInfo',retailerInfoSchema)
const DistributorInfo = mongoose.model('DistributorInfo',distributorInfoSchema)
const AdminInfo = mongoose.model('AdminInfo',adminInfoSchema)
const CustomerInfo  = mongoose.model('CustomerInfo',customerInfoSchema)



passport.use(Retailer.createStrategy());
passport.serializeUser((user, done)=> {done(null, user);});
passport.deserializeUser((user, done)=>{
  done(null, user); 
});






app.get('/register',(req,res)=>{
  // if(req.query){
  //   console.log(req.query)
  //   res.render('register',{msg:req.query})
  // }
  res.render('register',{msg:req.query.query})

})

app.get('/login',(req,res)=>{
  res.render('login')
})

// app.get('/auth/google',
//   passport.authenticate('google', { scope: [ 'email', 'profile' ]
// }));

// app.get('/auth/google/dash', passport.authenticate( 'google', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/login'
// }));



app.post('/register/retailer',function(req,res){
  const {username, password, email, phone, distributor} = req.body
  var retailerInfo = new RetailerInfo({
    username:username,
    email:email,
    phone:phone,
    distributor:distributor,
    billSubmitted:[]
  })
  retailerInfo.validate((err)=>{
    if(err){
      console.log("validation error");
        res.redirect(`/register?query=${err}`)
    } else{
      Retailer.register({username:username,accountType:"2"},password,(err)=>{
        if(err){
          console.log(err);
          res.redirect(`/register?query=${err.message}`)
        }
        else {
          retailerInfo.save((err,doc)=>{
            if(err){
              console.log(err);
              res.render('register',{msg:err})
            } else {
                    passport.authenticate('local')(req,res,()=>{
                    res.redirect('/dashboard')
                 })
              }
           })
         }
       })
    }
  })

})




app.post('/register/distributor',function(req,res){
  const {username, password} = req.body
  Retailer.register({username:username,accountType:"1"},password,(err)=>{
    if(err){
      console.log(err);
      res.redirect('/register',{msg:err})
    }
    else {
      passport.authenticate('local')(req,res,()=>{
        res.redirect('/dashboard')
      })
    }
  })
})




app.post('/login',(req,res)=>{
  const retailer = new Retailer({
    email:req.body.email,
    password:req.body.password
  })
  req.login(retailer,(err)=>{
    if(err){
      console.log(err);
      res.redirect('/register',{msg:err})
    } else {
      passport.authenticate("local")(req,res,function(){
        res.redirect('dashboard')
      })
    }
  })
})


app.get('/dashboard',function(req,res){
  if(req.isAuthenticated()){
    console.log(req.user);
    RetailerInfo.findOne({username:req.user.username},(err,foundUser)=>{
      if(!err){
        console.log(err,foundUser);
        res.render('dashboard',{name:foundUser})
      }
      else {
        console.log(err,foundUser);
        res.render('dashboard',{name:req.user})
      }
    })
  }
  else {
    res.render('login')
  }
})


app.get('/retailer/submit/',(req,res)=>{
  const {ref,customerName,kno,state,department} = req.body

  if(req.isAuthenticated()){
    DistributorInfo.findOne({username:ref},(err,foundUser)=>{
      if(err){
        res.redirect("/dashboard")
      } 
      customer = new CustomerInfo({
        ref:foundUser.id,
        kno:kno,
        state:state,
        department:department,
      })
      customer.save((err)=>{
        if(err){
          res.send(err)
        }
        else{
          res.sendStatus(200)
        }
      })
    })
  }
})

app.get('/remove',(req,res)=>{
  Retailer.remove((err)=>{
    console.log(err);
  })
  RetailerInfo.remove((err)=>{
    console.log(err
      );
  })
  res.send("removed")
})


app.listen(3000,function(){
  console.log('server started on port 3000');
})
