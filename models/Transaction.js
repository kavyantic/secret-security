const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')



const transactionSchema = new mongoose.Schema({
    type:{

    },
    customerNo:{

    },
    receiptNo:{

    },
    narration:{

    },
    amount:Number,
    date:{
        type:Date,
        default:Date.now
    },
    from:{
        id:{

            type:mongoose.Schema.Types.ObjectId,
            refPath:"refModel"
        },
        name:{
            type:String
        }
    },
    to:{
        id:{

            type:mongoose.Schema.Types.ObjectId,
            refPath:"refModel"
        },
        name:{
            type:String
        }
    },
    refModel:{
        type:String,
        enum:['Retailer','Distributor','SuperDistributor','Admin']
    }
})
transactionSchema.plugin(AutoIncrement.plugin,{model:'Transaction',field:"id"}) 

mongoose.model('Transaction',transactionSchema)


