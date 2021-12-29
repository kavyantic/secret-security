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

var isProduction = process.env.NODE_ENV === 'production';

dbUrl = isProduction?process.env.DB_URL:process.env.LOCAL_DB_URL
mongoose.connect("mongodb+srv://rahulkavya9610:painter05@cluster0.afuye.mongodb.net/rechargePortal?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex',true)

require('./models/User')
require('./models/Admin')
require('./models/Retailer')
require('./models/Distributor')
require('./models/SuperDistributor')
require('./models/WaterBill')
require('./models/ElectricityBill')



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
app.use(require('./routes'));
require('./config/passport');

// admin = {
//   username:"admin"
//   ,password:"painter"
//   ,accountType:"admin"
// }
// User = mongoose.model('User')
// Admin = mongoose.model('Admin')

a  = new User(admin).save()
b = new Admin(admin).save()

PORT = process.env.PORT||3000
app.listen(PORT,function(){
  console.log('server started on port '+PORT);
})
