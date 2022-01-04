const router = require('express').Router();
const mongoose = require('mongoose');

const User = mongoose.model('User')
const Admin = mongoose.model('Admin')
const Retailer = mongoose.model('Retailer')
const Distributor = mongoose.model('Distributor')
const SuperDistributor = mongoose.model('SuperDistributor')
const ElectricityBill = mongoose.model('ElectricityBill')
const ProElecBill = mongoose.model('ProcessingElectricityBill')
const WaterBill = mongoose.model('WaterBill')
const ProWaterBill = mongoose.model('ProcessingWaterBill')
const Transaction = mongoose.model('Transaction')
const xlsx = require('node-xlsx')
// const xlsx = require('xlsx')



// router.param('type',(req,res,next,type)=>{
//   type = type.toLowerCase()
//   if(type==="retailer"){
//     req.model = Retailer
//   } else if(type==="distributor"){
//     req.model = Distributor
//   } else  if(type==="superdistributor"){
//     req.model = SuperDistributor
//   }
//   else {
//    return next(null)
//   }
//   return next()
// })
router.use((req,res,next)=>{
  
  if((req.isAuthenticated() && req.user.accountType==="superdistributor")){
      return next()
  } else {
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&red=superDistributor/${req.url}`)
      } 
      else {
        res.redirect(`/login?msg=Please login again`)
      }
  }
  
})
router.get('/dashboard',(req,res)=>{
       info = {
         user:req.user
       }
      res.render('superDistributor/dashboard',{info:info})
 })
router.get('/bills/electricity/new',(req,res)=>{
    ElectricityBill.find({},(err,bills)=>{ 
      info = {
        user:req.user,
        bills:bills,
        query:"electiricity",
        title:"Electricity bills"
      }
     res.render('admin/newBills',{info:info})
    })
})
router.get('/bills/electricity/processing/',(req,res)=>{
    ProElecBill.find({},(err,bills)=>{
      info = {
        user:req.user,
        bills:bills,
        query:"electricity",
        title:"Electricity bills"
      }
     res.render('superDistributor/processingBills',{info:info})
    })
})
router.get('/bills/water/new',(req,res)=>{
    WaterBill.find({},(err,bills)=>{ 
      info = {
        user:req.user,
        bills:bills,
        query:"water",
        title:"Water bills"
      }
     res.render('superDistributor/newBills',{info:info})
  })
})
router.get('/bills/water/processing',(req,res)=>{
    ProWaterBill.find({},(err,bills)=>{
      info = {
        user:req.user,
        bills:bills,
        query:"water",
        title:"Water bills"
      }
     res.render('superDistributor/processingBills',{info:info})
    })
})
router.get('/members/list/:type',(req,res)=>{
  type = req.params.type
   User.find({_id:{$in:req.user.myMembers[type]}}).then((result)=>{
      info = {
        userType:type,
        user:req.user,
        members:result
      }
     res.render('superDistributor/listMembers',{info:info})
  })
})
router.get('/members/info/:type/:user',(req,res)=>{
  req.model.findOne({username:req.params.user},(err,foundUser)=>{
    if(!err){
      res.send(foundUser)
    } else {
      res.send(err)
    }
  })
}) 
router.get('/members/register',(req,res)=>{
    info = {
      user:req.user,
    }
   res.render('distributor/registerMember',{info:info})
})
router.get('/members/update/:type/:user',(req,res)=>{
  let user = req.params.user
  let type = req.params.type
  User.findOne({username:user},(err,foundMember)=>{
      info = {
        userType:type,
        userName:user,
        user:req.user,
        auth:foundMember,
      }
      res.render('admin/updateMember',{info:info})
    })
})

router.get('/transactions',(req,res)=>{
  Transaction.find({},(err,docs)=>{
    var info = {
      title:"Transactions",
      transactions:docs
    }
    console.log(docs);
    res.render('admin/transactions',{info:info})
  })
})



// Posts //
router.post('/members/update/:type/:user',(req,res)=>{
  let user = req.params.user
  let data = req.body 
  let type = req.params.type
  data.canSetServiceTime = data.canSetServiceTime?true:false
  data.canViewReport = data.canViewReport?true:false
  data.canRegisterAccount = data.canRegisterAccount?true:false
  data.canUploadBills = data.canUploadBills?true:false
  data.canAddMoney = data.canAddMoney?true:false
  data.canDeductMoney = data.canDeductMoney?true:false
  User.updateOne({username:user},data,{},(err,updatedUser)=>{
        if(!err){
          res.redirect('/admin/members/list/'+type)
        } else {
           console.log(err);
        }
      })
})

router.post('/transactions',(req,res)=>{
  const {toDate,fromDate,toName,fromName,type} = req.body
  query = {}
  if(toDate || fromDate){
    query.date= {}
    toDate?query.date["$lte"] = new Date(req.body.toDate.split("-")).setHours(24):""
    fromDate?query.date["$gte"] = new Date(req.body.fromDate.split("-")).setHours(0, 0, 0, 0):""
  }
  toName?query["to.name"] = toName:""
  fromName?query["from.name"] = fromName: ""
  console.log(query);
  Transaction.find(query,
    (err,docs)=>{
    var info = {
      title:"Transactions",
      transactions:docs,
      toDate:toDate,
      fromDate:fromDate,
      toName:toName,
      fromName:fromName
    }
    res.render('admin/transactions',{info:info})
  })
})

router.post('/members/register/:type',(req,res)=>{
  let type = req.params.type.toLowerCase()  
  let data = req.body
  data.accountType = type
  data.canSetServiceTime = data.canSetServiceTime?true:false
  data.canViewReport = data.canViewReport?true:false
  data.canRegisterAccount = data.canRegisterAccount?true:false
  data.canUploadBills = data.canUploadBills?true:false
  data.canAddMoney = data.canAddMoney?true:false
  data.canDeductMoney = data.canDeductMoney?true:false
  console.log(data);
  user = new User(data)
  user.save((err,savedUser)=>{
        if(!err){
          if(type=='retailer'){
            User.updateOne({_id:req.user._id},{$push:{'myMembers.retailer':savedUser._id}},{},(err)=>{
              if(!err){
                res.status(200).send({msg:"Successfull"})
  
              } else {  
                res.send(err)
              }
            })
          } else if(type=='distributor') {
            User.updateOne({_id:req.user._id},{$push:{'myMembers.distributor':savedUser._id}},{},(err)=>{
              if(!err){
                res.status(200).send({msg:"Successfull"})
  
              } else {
                res.send(err)
              }
            })
          }
         
          // req.user.myMembers.retailer.push(savedRetailer._id)
        } else {
          res.status(400).send(err)
        }
      })
})

router.post('/members/updateBalance/:type/:user',(req,res)=>{
  let amt = req.body.amount
  let type = req.params.type
  let pos_amt = Math.abs(amt)
  User.findOneAndUpdate({username:req.params.user},{"$inc":{"balance":amt}},{},(err,doc)=>{
    if(!err){
      res.redirect('/admin/members/list')
      if(amt>0){
        transaction = new Transaction({
         amount:pos_amt,
         from:{
           id:req.user._id,
           name:req.user.username
          },
         to:{
           id:doc._id,
           name:doc.username
         } 
        })
      } else {
        transaction = new Transaction({
          amount:pos_amt,
          to:{  
            id:req.user._id,
            name:req.user.username
           },
          from:{
            id:doc._id,
            name:doc.username
          } 
         })
      }
      transaction.save((err,doc)=>{
        console.log(err,doc);
      })
     
    }
    else {
      res.status(400).send(err)
    }
  })
})


router.get('/createBatch/electricity',(req,res)=>{
  ElectricityBill.find({},(err,bills)=>{
   procBills = bills.map((e)=>{
      return {
        submittedBy : e.submittedBy,
        submittedByName : e.submittedByName,
        customerName : e.customerName,
        submittedAt : e.submittedAt,
        kno : e.kno,
        state:e.state,
        department:e.department,
        billDueDate:e.billDueDate,
        amount:e.amount,
        id:e.id
      }
    })
    ProElecBill.insertMany(procBills,(err,newBills)=>{
        if(!err){
          ElectricityBill.deleteMany({},(err)=>{
            if(err){
              res.send(newBills)
            } else {
              res.send(err)
            }
          })
        } else {
          res.send(err)
        }
    })
  })
})


router.post('/bills/electricity/uploadStatus',(req,res)=>{
  let a = xlsx.parse(req.files.file.data)
  let data = a[0].data
  let arr = []
  data.map((e,i)=>{
    obj =   {}
    if(!(i<=1)){
      obj.id = e[0]
      obj.status = e[6]
      obj.receiptNo = e[7]
      if(obj.id){
        ProElecBill.updateOne({id:obj.id},{status:obj.status,receiptNo:obj.receiptNo},{},(err,doc)=>{
          if(!err){
            console.log(err);
          }
        })
      }
      arr.push(obj)
    }
  })
  res.redirect('/admin/bills/electricity/processing/')

    // let wb= xlsx.read(req.files.file.data);
  // let ws = wb.Sheets[wb.SheetNames[0]];
  // let data = xlsx.utils.sheet_to_json(ws);
  // for(d in data){
  //   console.log(data[d]);
  // }

})

module.exports = router









