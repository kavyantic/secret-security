const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')

// userSchema = new mongoose.Schema({
//     username:{
//       type:String,
//       unique:true
//      },
      
//     accountType:{
//         type:String,
//         required:true,
//         enum:["admin","superdistributor","distributor","retailer"]
//     },
//     // accountType:{
//     //   type:mongoose.Schema.Types.ObjectId,
//     //   refPath:"refModel"
//     // },
//     // refModel:{
//     //   type:String,
//     //   enum:["Admin","SuperDistributor","Distributor","Retailer"]
//     // },
    
//     password: {
//       type: String,
//       minlength: 4,
//       maxlength: 16,
//       trim: true,
//     },
//     canSetServiceTime:{type:Boolean,default:false},
//     canViewReport:{type:Boolean,default:false},
//     canRegisterAccount:{type:Boolean,default:false},
//     canUploadBills:{type:Boolean,default:true},
//     canAddMoney:{type:Boolean,default:true},
//     canDeductMoney:{type:Boolean,default:true}
//   })


userSchema = new mongoose.Schema({
    username:{
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
      // $regex: '^[6-9]\d{9}$' 
  
    },
    mySponser:{
      name:{type:String},
      id:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"refModel"
      }
    },
    balance:Number,
    myRetailers:[
      {type:mongoose.Schema.Types.ObjectId,ref:"Retailers"}
    ],
    myDistributor:[
      {type:mongoose.Schema.Types.ObjectId,ref:"Distributor"}
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
  
userSchema.methods.verifyPassword = (password)=>{
  return true
}




mongoose.model("User",userSchema)

