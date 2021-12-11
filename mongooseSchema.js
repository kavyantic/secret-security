const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')


retailerSchema = new mongoose.Schema({
    username:{String},
    accountType:{type:Number,required:true},
    password: {
      type: String,
      minlength: 8,
      maxlength: 16,
      trim: true,
    }
  }).plugin(passportLocalMongoose)
  

userSchema = new mongoose.Schema({
    username:{String},
    accountType:{type:Number,required:true},
    password: {
      type: String,
      minlength: 8,
      maxlength: 16,
      trim: true,
    }
  }).plugin(passportLocalMongoose)
  

customerInfoSchema = {
  ref:{
    type:mongoose.Schema.Types.ObjectId
  },
  active:Boolean,
  customerName:String,
  kno:{
    type:String,
    unique:true,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  department:{
    type:String,
    required:true
  }
}

retailerInfoSchema = new mongoose.Schema({
  active:Boolean,
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  email:{
    type: String,
    lowercase: true,
    trim: true,
    require:[true,"Please enter your email"],
    unique:[true,"A retailer with this email already exists"],
    validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ],
  },
  phone:{
    type:String,
    unique:[true,"Please provide your phone number"],
    minlength:10,
    maxlength:10,
    $regex: '^[6-9]\d{9}$' 
  },
  distributor:{
    type:mongoose.Schema.Types.ObjectId,
  },
  billSubmitted:[
    customerInfoSchema
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
    type: String,
    lowercase: true,
    require:[true,"Please enter your email"],
    unique:[true,"A distributor with this email already exists"],
    trim: true,
    validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ],
  },
  phone:{
    type:String,
    unique:true,
    $regex: '^[6-9]\d{9}$' 

  },
 retailers:[
  {type:mongoose.Schema.Types.ObjectId}
 ]
})



adminInfoSchema = new mongoose.Schema({
  active:Boolean,
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  email:{
    type: String,
    lowercase: true,
    trim: true,
    validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ],
  },
  phone:{
    type:String,
    unique:true,
    $regex: '^[6-9]\d{9}$' 
  }
})
  

// const Retailer = mongoose.model('Retailer', retailerInfoSchema);
// var ret = new Retailer({username:""})
// ret.set
// console.log(ret.validateSync())





exports  =  {

  retailerSchema,
  // adminInfoSchema, 
  customerInfoSchema,
  retailerInfoSchema,
  distributorInfoSchema
}; 