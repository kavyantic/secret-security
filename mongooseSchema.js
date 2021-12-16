const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')

retailerSchema = new mongoose.Schema({
    username:{String},
    accountType:{type:Number,required:true},
    password: {
      type: String,
      minlength: 6,
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
  
customerInfoSchema = new mongoose.Schema({
  serial:Number,
  submittedBy:{
    type:String
  },
  customerName:String,
  submittedAt: {type: Date, default: Date.now},
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
  },
  billDueDate:{
    type:String
  },
  amount:String

}).plugin(AutoIncrement, {inc_field: 'serial'})


processingCustomerInfo = new mongoose.Schema({
  submittedBy:{ 
    type:String
  },
  batchId:Number,
  serial:Number,
  status:{
    type:String,
    enum:["PROCESSING","SUCCESSFUL","FAILD"],
    default:"PROCESSING"
  },
  customerName:String,
  submittedAt: {type: Date, default: Date.now},
  active:Boolean,
  kno:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  department:{
    type:String,
    required:true
  },
  billDueDate:{
    type:String
  },
  amount:String

})





retailerInfoSchema = new mongoose.Schema({
  active:Boolean,
  balance:{
    default:0,
    type:Number
  },
  usedBalance:{
    default:0,
    type:Number
  },
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 16,
    trim: true,
  },
    email:{
    type: String,
    lowercase: true,
    trim: true,
    require:[true,"Please enter your email"],
    // unique:[true,"A retailer with this email already exists"],
    validate: [
      validator({
        validator: 'isEmail',
        message: 'Oops..please enter valid email'
      })
    ],
  },
  phone:{
    type:String,
    // unique:[true,"Please provide your phone number"],
    minlength:6,
    maxlength:10,
    $regex: '^[6-9]\d{9}$' 
  },
  sponserId:{
    // required:true,
    // type:mongoose.Schema.Types.ObjectId,
    type:String
  },
  billSubmitted:[
    {type:Number}
  ]
})



distributorInfoSchema = new mongoose.Schema({
  active:Boolean,
  balance:{
    default:0,
    type:Number
  },
  usedBalance:{
    default:0,
    type:Number
  },
  username:{
    type:String,
    unique:true,
    index:true,
    required:true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 16,
    trim: true,
  },
  email:{
    type: String,
    lowercase: true,
    require:[true,"Please enter your email"],
    // unique:[true,"A distributor with this email already exists"],
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
    // unique:true,
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
  
var Retailer = mongoose.model('Retailer',retailerSchema)
var RetailerInfo = mongoose.model('RetailerInfo',retailerInfoSchema)
var DistributorInfo = mongoose.model('DistributorInfo',distributorInfoSchema)
var AdminInfo = mongoose.model('AdminInfo',adminInfoSchema)
var CustomerInfo  = mongoose.model('CustomerInfo',customerInfoSchema)
var ProcessingCustomerInfo  = mongoose.model('ProcessingCustomerInfo',processingCustomerInfo)



// mongoose.connect('mongodb://localhost:27017/rechargePortal',{useNewUrlParser:true,useUnifiedTopology:true})
// mongoose.set('useCreateIndex',true)

// const RetailerInfo = mongoose.model('RetailerInfo', retailerInfoSchema);
// var ret = new RetailerInfo({username:"kavyss",email:"rahulkvy9610@gmail.com",phone:"4545454454",distributor:"sdfsd",})
// // ret.save((err,doc)=>{
// //   console.log(err,doc);
// // })
// RetailerInfo.
// console.log(ret.validateSync())


module.exports = {
  Retailer,
  RetailerInfo,
  DistributorInfo,
  AdminInfo,
  CustomerInfo,
  ProcessingCustomerInfo
}

