const validator = require('mongoose-validator')

infoSkeleton = { 
    name:{
      type:String
    },

    date:{
      type:Date,
      default:Date.now
    },
    address:String,
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
  
    }
  }



module.exports = infoSkeleton

