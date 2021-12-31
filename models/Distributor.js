const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')
const uniqueValidator = require('mongoose-unique-validator');
const InfoSchema = require('./Info')


distributorSchema = new mongoose.Schema({
  ...InfoSchema
,
sponseredBy:{
  type:mongoose.Schema.Types.ObjectId,
  refPath:'sponseredModel'
},
sponseredModel:{
  type:String,
  enum:['Admin',"SuperDistributor"]
}
,
  sponseredByName:{
    type:String 
  }, 
  
    active:Boolean,
    balance:{
      default:0,
      type:Number
    },
   retailers:[
    {type:mongoose.Schema.Types.ObjectId}
   ],

  })


distributorSchema.plugin(uniqueValidator, {message: 'is already taken'});

mongoose.model('Distributor',distributorSchema)
// console.log(Object.keys(mongoose.model('Distributor').schema.tree)
// )


