const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const validator = require('mongoose-validator')
const uniqueValidator = require('mongoose-unique-validator');



electricityBillSchema = new mongoose.Schema({
    submittedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Retailer"
    },
    submittedByName:{
        type:String
    },
    customerName:{
        type:String,
        default:"No name provided"
    },
    submittedAt: {type: Date, default: Date.now},
    active:{
        type:Boolean,
        default:false
    },
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
  
  })

  electricityBillSchema.plugin(AutoIncrement.plugin,{model:'ElectricityBill',field:"id"}) 
  




  
processingElectricityBillSchema = new mongoose.Schema({
    _id:Number,
    submittedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Retailer"
      },
      submittedByUsername:{
          type:String
      },
    batchId:Number,
    batchDate:{
        type:Date,
        default:Date.now

    },
    status:{
      type:String,
      enum:["PROCESSING","SUCCESSFUL","FAILD"],
      default:"PROCESSING"
    },
    customerName:String,
    submittedAt: {type: Date},
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
    paymentId:{
        type:String
    },
    amount:String
  
  })

  processingElectricityBillSchema.plugin(AutoIncrement.plugin,{model:'ProcessingElectricityBill',field:"batchId"}) 



  mongoose.model('ElectricityBill',electricityBillSchema)
  mongoose.model('ProcessingElectricityBill',processingElectricityBillSchema)
  