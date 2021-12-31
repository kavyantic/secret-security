
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
    sponseredByName:{
        type:String
    },
    sponseredBy:{
      type:mongoose.Schema.Types.ObjectId,
      refPath:'sponseredModel'
    },
    sponseredModel:{
      type:String,
      enum:['Admin',"SuperDistributor","Distributor"]
    },
    billSubmitted:[
      {type:Number}
    ]
    
  })
  
//  retailerSchema.statics.updateBalance = (username,amt)=>{
//     amt = Number(amt)
//     this.updateOne({username:username},{"$inc":{"balance":amt}},{},(err,doc)=>{
//       return err,doc
//     })
//   }


// mongoose.Schema.methods.addMoney = (amt)=>{
//   amt = Number(amt)
//   this.balance += amt 
//   return await this.save()
// }
retailerSchema.plugin(uniqueValidator, {message: 'is already taken'});


mongoose.model('Retailer',retailerSchema)


  
  