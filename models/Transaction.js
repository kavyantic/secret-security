const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('mongoose-validator')



const transactionSchema = new mongoose.Schema({
    active:{
        type:Boolean,
        default:true
    },
    type:{
        type:String,
        enum:['FUNDADD','FUNDLESS','BILLUPLOAD','FUNDREQUEST']
    },
    department:{
        type:String
    },

    status:{
        type:String,
        enum:['APPROVED','PENDING','REJECTED','PROCESSING'],
        default:'APPROVED'
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
        accountType:{
            type:String,
            enum:['retailer','distributor','superdistributor','admin','electricity','water']
        },
        id:{

            type:mongoose.Schema.Types.ObjectId,
            refPath:"refModel"
        },
        name:{
            type:String
        }
    },
    to:{
        accountType:{
            type:String,
            enum:['retailer','distributor','superdistributor','admin','electricity','water']
        },
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
transactionSchema.plugin(AutoIncrement.plugin,{model:'Transaction',field:"id",startAt: 101}) 

mongoose.model('Transaction',transactionSchema)


