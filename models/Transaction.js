const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')



const transactionSchema = new mongoose.Schema({
    amount:Number,
    date:{
        type:Date,
        default:Date.now
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"refModel"
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"refModel"
    },
    refModel:{
        type:String,
        enum:['Retailer','Distributor','SuperDistributor','Admin']
    },
    toName:String,
    fromName:String
})


mongoose.model('Transaction',transactionSchema)


