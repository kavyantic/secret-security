const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('mongoose-validator')


userSchema = new mongoose.Schema({
    username:{
      collation: {
        locale: 'en',
        strength: 2
      },
      type:String,
      unique:true
     },
    accountType:{
        type:String,
        required:true,
        enum:["admin","superdistributor","distributor","retailer"]
    },
    password: {
      type: String,
      minlength: 4,
      maxlength: 16,
      trim: true,
    },
    name:{
      type:String
    },
    date:{
      type:Date,
      default:Date.now
    },
    address:String,
    email:{
      type: String,
      lowercase: true,
      // require:[true,"Please enter your email"],
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
      // $regex: '^[6-9]\d{9}$' 
    
    },
    creditLimit:{
      type:Number,
      default:0
    },
    mySponser:{
      type:String
    },
    balance:{
      type:Number,
      default:0
    },
    myRetailers:[
      // {type:mongoose.Schema.Types.ObjectId,ref:"Retailers"}
      {type:String}
    ],
    myDistributors:[
      // {type:mongoose.Schema.Types.ObjectId,ref:"Distributor"}
      {type:String }
    ],
    myBills:{
      electricity:[],
      water:[]
    },
    refModel:{
      type:String,
      enum:['Admin',"SuperDistributor","Distributor"]
    },
    canSetServiceTime:{type:Boolean,default:true},
    canViewReport:{type:Boolean,default:true},
    canCreateAccount:{type:Boolean,default:true},
    canUploadBills:{type:Boolean,default:true},
    canAddMoney:{type:Boolean,default:true},
  })
  
  
userSchema.plugin(uniqueValidator, {message: '{VALUE} is already in use'});

userSchema.methods.verifyPassword = (password)=>{
  return true
}




mongoose.model("User",userSchema)

