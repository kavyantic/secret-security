const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

userSchema = new mongoose.Schema({
    username:String,
    password:String
  }).plugin(passportLocalMongoose)
  


customerIdSchema = {
  active:Boolean,
  name:String,
  kno:{type:String,unique:true},
  state:{type:String,required:true},
  department:{type:String,required:true}
}

userInfoSchema = new mongoose.Schema({
  active:Boolean,
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  email:{
    type:String,
    unique:true
  },
  phone:{
    type:String,
    unique:true
  },
  distributor:{
    type:String,
    unique:true
  },
  billSubmitted:[
    customerIdSchema
  ]
})



distributorInfoSchema = new mongoose.Schema({
  active:Boolean,
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  email:{
    type:String,
    unique:true
  },
  phone:{
    type:String,
    unique:true
  },
 retailers:[
  retailerInfoSchema
 ]
})
  

const Retailer = mongoose.model('Retailer', retailerInfoSchema);
var ret = new Retailer({})





exports  =  {
  retailerSchema, 
  adminSchema,
  distributorSchema,
  customerIdSchema,
  retailerInfoSchema,
  distributorInfoSchema
}; 