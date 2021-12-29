const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')

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
    accountRef:{
      type:mongoose.Schema.Types.ObjectId
    },
    // _admin:{type: mongoose.Schema.Types.ObjectId,ref: },
    // _superDistributor:{},
    // _distributor:{},
    // _retailer:{},
    password: {
      type: String,
      minlength: 4,
      maxlength: 16,
      trim: true,
    },
    canSetServiceTime:{type:Boolean,default:true},
    canViewReport:{type:Boolean,default:true},
    canCreateAccount:{type:Boolean,default:true},
    canUploadBills:{type:Boolean,default:true},
    canAddMoney:{type:Boolean,default:true},
  })
  // userSchema.plugin(passportLocalMongoose)
  

userSchema.methods.verifyPassword = (password)=>{
  return true
}

userSchema.methods.take = ()=>{
  return "take it "
}


mongoose.model("User",userSchema)

