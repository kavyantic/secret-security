
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')
const uniqueValidator = require('mongoose-unique-validator');
const InfoSchema = require('./Info')

retailerSchema = new mongoose.Schema({
    ...InfoSchema,
    active:Boolean,
    balance:{
      default:0,
      type:Number
    },

    sponserBy:{
        type:String
    },
    sponserId:{
      // required:true,
      type:mongoose.Schema.Types.ObjectId,
   },
    billSubmitted:[
      {type:Number}
    ]
    
  })


retailerSchema.plugin(uniqueValidator, {message: 'is already taken'});


mongoose.model('Retailer',retailerSchema)


  
  