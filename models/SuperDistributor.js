const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')
const uniqueValidator = require('mongoose-unique-validator');
const InfoSchema = require('./Info')

superDistributorSchema = new mongoose.Schema({
    ...InfoSchema,
    active:{
        type:Boolean,
        default:false
    },
    balance:{
      default:0,
      type:Number
    },
    myRetailers:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Retailer"
      }
    ],
    myDistributors:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Distributor"
      }
    ],
   canSetServiceTime:{type:Boolean,default:true},
   canViewReport:{type:Boolean,default:true},
   canCreateAccount:{type:Boolean,default:true},
   canUploadBills:{type:Boolean,default:true},
   canAddMoney:{type:Boolean,default:true},
   canDeductMoney:{type:Boolean,default:true}
  })


superDistributorSchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.model('SuperDistributor',superDistributorSchema)
  