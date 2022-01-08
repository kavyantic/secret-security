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
  if((req.isAuthenticated() && req.user.accountType==="distributor")){
      return next()
  } else {
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&re=distributor/${req.url}`)
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
      res.render('distributor/dashboard',{info:info})
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
     res.render('admin/processingBills',{info:info})
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
     res.render('admin/newBills',{info:info})
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
     res.render('admin/processingBills',{info:info})
    })
})
router.get('/members/list/',(req,res)=>{
   User.find({username:{$in:req.user.myRetailers}}).then((result)=>{
      info = {
        user:req.user,
        members:result
      }
     res.render('distributor/listMembers',{info:info})
  })
})
router.post('/members/updateBalance/:user',(req,res)=>{
  let amt = Number(req.body.amount)
  let pos_amt = Math.abs(amt)
  let member = req.params.user
  if(amt>0){
    if(req.user.myRetailers.includes(member)){
      if(Number(req.user.balance)>=Number(amt)){
        User.findOneAndUpdate({username:member},{"$inc":{"balance":amt}},{},(err,doc)=>{
          if(!err){
            res.redirect('/distributor/members/list/')
            if(amt>0){
              transaction = new Transaction({
              type:'FUNDADD',
              department:'SELF',
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
                type:'FUNDLESS',
                department:'SELF',
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
            User.updateOne({username:req.user.username},{"$inc":{"balance":(amt*-1)}},{},(err)=>{console.log(err,user);})
            transaction.save((err,doc)=>{
              console.log(err,doc);
            })
           
          }
          else {
            res.status(400).send(err)
          }
        })
      } else {
        res.redirect('/distributor/members/list')
      }
    }
  }
 

})
router.get('/ledger',(req,res)=>{
  query = {$or:[
    {'to.name':req.user.username},
    {'from.name':req.user.username}
  ],active:true}
      Transaction.find(query,(err,docs)=>{
        var info = {
          user:req.user,
          transactions:docs,
          ledgerAccount:req.user,
          totalDr:0,
          totalCr:req.user.balance,
          index:1
        }
     
      res.render('distributor/ledger',{info:info})
  })
})

router.get('/transactions',(req,res)=>{
  Transaction.find({$or:[
    {'to.name':req.user.username},
    {'from.name':req.user.username}
  ],active:true},(err,docs)=>{
    console.log(docs);
    var info = {
      user:req.user,
      totalDr:0,
      totalCr:0,
      title:"My Transactions",
      transactions:docs
    }
    console.log(docs);
    res.render('distributor/transactions',{info:info})
  })
})
router.get('/members/update/:user',(req,res)=>{
  let user = req.params.user
  User.findOne({username:user},(err,foundMember)=>{
    if(req.user.myRetailers.includes(foundMember.username)){
      info = {
        user:req.user,
        auth:foundMember,
      }
      res.render('distributor/updateMember',{info:info})
    } else {
      res.send('Retailer is not under you')
    }
  })
})
router.get('/members/register',(req,res)=>{
    info = {
      user:req.user,
    }
   res.render('distributor/registerMember',{info:info})
})





// router.post('/members/update/:user',(req,res)=>{
//   let user = req.params.user
//   let data = req.body 
//   data.canViewReport = data.canViewReport?true:false
//   data.canUploadBills = data.canUploadBills?true:false
//   User.updateOne({username:user},data,{},(err,updatedUser)=>{
//         if(!err){
//           res.redirect('/distributor/members/list/')
//         } else {
//            console.log(err);
//            res.send(err)
//         }
//       })
// })
// router.post('/transactions',(req,res)=>{
//   const {toDate,fromDate,toName,fromName,type} = req.body
//   query = {}
//   if(toDate || fromDate){
//     query.date= {}
//     toDate?query.date["$lte"] = new Date(req.body.toDate.split("-")).setHours(24):""
//     fromDate?query.date["$gte"] = new Date(req.body.fromDate.split("-")).setHours(0, 0, 0, 0):""
//   }
//   toName?query["to.name"] = toName:""
//   fromName?query["from.name"] = fromName: ""
//   console.log(query);
//   Transaction.find(query,
//     (err,docs)=>{
//     var info = {
//       title:"Transactions",
//       transactions:docs,
//       toDate:toDate,
//       fromDate:fromDate,
//       toName:toName,
//       fromName:fromName
//     }
//     res.render('admin/transactions',{info:info})
//   })
// })
router.post('/members/register/',(req,res)=>{
  let data = req.body
  data.accountType = 'retailer'
  data.canViewReport = data.canViewReport?true:false
  data.canUploadBills = data.canUploadBills?true:false
  console.log(data);
  
  user = new User(data)
  user.save((err,savedRetailer)=>{
        if(!err){
          User.updateOne({_id:req.user._id},{$addToSet:{'myRetailers':savedRetailer._id}},{},(err)=>{
            if(!err){
              res.status(200).send({msg:"Successfull"})

            } else {
              res.send(err)
            }
          })
          // req.user.myMembers.retailer.push(savedRetailer._id)
        } else {
          res.status(400).send(err)
        }
      })
})
router.post('/members/updateBalance/:type/:user',(req,res)=>{
  let amt = req.body.amount
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




module.exports = router









