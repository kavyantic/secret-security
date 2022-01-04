const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const validator = require('mongoose-validator')



batchElectricity = new mongoose.Schema({
    name:{
        type:String,
        default:"No batch name"
    },
    date:{
        type:Date,
        default:Date.now
    },
   bills :[
        {
            type:Number
        }
   ]
  
  })

batchWater = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now
    },
   bills :[
       {
           type:Number
       }
   ]
  
  })

batchElectricity.plugin(AutoIncrement.plugin,{model:'BatchElectricity',field:"id"}) 
batchWater.plugin(AutoIncrement.plugin,{model:'BatchWater',field:"id",startAt: 100}) 

  




  mongoose.model('BatchElectricity',batchElectricity)
  mongoose.model('BatchWater',batchWater)
  