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
const BatchElectricity =   mongoose.model('BatchElectricity')
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
  if(req.isAuthenticated() && req.user.accountType==="admin"){
      return next()
  } else {
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&re=/${req.url}`)
      } 
      else {
        res.redirect(`/login?msg=Please login again`)
      }
  }
})
router.get('/dashboard',(req,res)=>{ 
  console.log(process.env.serviceTime);
    var future = new Date(); 
    prevMonth = future.setDate(future.getDate() - 30);
    prevDate = future.setDate(future.getDate() - 1);
    ProElecBill.f
    Transaction.find({status:"PENDING"},(err,transactions)=>{
      info = { 
        serviceTime : process.env.serviceTime,
        user:req.user,
        transactions:transactions 
      }
      
     res.render('admin/dashboard',{info:info})
    }) 
 })
router.get('/:accountName/addMember',(req,res)=>{
  let name = req.params.accountName
  User.findOne({'username':name},(err,foundUser)=>{
  if(!err && foundUser){
    console.log(foundUser);
    if(foundUser.accountType=="distributor"){
      User.find({accountType:'retailer'},(err,retailers)=>{
        info = {
          name:name,
          alreadyAdded:foundUser.myRetailers,
          user:req.user,
          members:retailers,
          accountType:foundUser.accountType,
          memberType:"Retailers"
        }
        res.render('admin/addChildMember',{info:info})
      })
    } else if(foundUser.accountType=='superdistributor') {
      User.find({accountType:'distributor'},(err,dist)=>{
        info = {
          name:name,
          user:req.user,
          alreadyAdded:foundUser.myDistributors,
          members:dist,
          accountType:foundUser.accountType,
          memberType:"Distributors"
        }
        res.render('admin/addChildMember',{info:info})
      })
    } else {
      res.send("sorry")
    }
  } else {
    console.log(err,foundUser);
    res.redirect("/admin/dashboard")
  }
  
  })

})
router.get('/addMember/:parentMember/:parentAccountType/:childMember',(req,res)=>{
  parentMember = req.params.parentMember
  childMember = req.params.childMember
  parentAccountType = req.params.parentAccountType
  if(parentAccountType=='distributor'){
    User.findOneAndUpdate({username:childMember},{mySponser:parentMember},(err,updatedChild)=>{
        User.updateOne({username:parentMember},{$addToSet:{myRetailers:updatedChild._id}},(err,doc)=>{
          res.redirect(`/admin/${parentMember}/addMember/`)
        })
    })
  } else if(parentAccountType=='superdistributor') {
    User.findOneAndUpdate({username:childMember},{mySponser:parentMember},(err,updatedChild)=>{
        User.updateOne({username:parentMember},{$addToSet:{myDistributors:updatedChild._id}},(err,doc)=>{
          res.redirect(`/admin/${parentMember}/addMember/`)
        })
    })
  }

})
router.get('/removeMember/:parentMember/:parentAccountType/:childMember',(req,res)=>{
  parentMember = req.params.parentMember
  childMember = req.params.childMember
  parentAccountType = req.params.parentAccountType
  if(parentAccountType=='distributor'){
    User.findOneAndUpdate({username:childMember},{mySponser:""},(err,updatedChild)=>{
        User.updateOne({username:parentMember},{$pull:{myRetailers:updatedChild._id}},(err,doc)=>{
          res.redirect(`/admin/${parentMember}/addMember/`)
        })
    })
  } else if(parentAccountType=='superdistributor') {
    User.findOneAndUpdate({username:childMember},{mySponser:""},(err,updatedChild)=>{
        User.updateOne({username:parentMember},{$pull:{myDistributors:updatedChild._id}},(err,doc)=>{
          res.redirect(`/admin/${parentMember}/addMember/`)
        })
    })
  }
})
 router.post('/settime',(req,res)=>{
   process.env.serviceTime = req.body.serviceTime
   res.redirect("/admin/dashboard")
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
    BatchElectricity.nextCount((err,count)=>{
    if(count>101){
      BatchElectricity.findOne({id:count-1},(err,batch)=>{
        ProElecBill.find({id:{$in:batch.bills}},(err,bills)=>{
          info = {
            batchCount:count-1,
            user:req.user,
            bills:bills,
            query:"electricity",
            title:"Electricity bills"
          }
         res.render('admin/processingBills',{info:info})
        })   
       })
    } else {
      ProElecBill.find({},(err,bills)=>{
        info = {
          batchCount:0,
          user:req.user,
          bills:bills,
          query:"electricity",
          title:"Electricity bills"
        }
       res.render('admin/processingBills',{info:info})
      })   
    }
    
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
router.get('/members/list/:accountType',(req,res)=>{
   User.find({accountType:req.params.accountType}).then((result)=>{
     
      info = {
        accountType:req.params.accountType.toUpperCase(),
        user:req.user,
        members:result
      }
     res.render('admin/listMembers',{info:info})
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
      msg: req.query.msg

    }
   res.render('admin/registerMember',{info:info})
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
      user:req.user,
      title:"Transactions",
      transactions:docs
    }
    console.log(docs);
    res.render('admin/transactions',{info:info})
  })
})
router.post('/fundRequest/update/',(req,res)=>{
  id = req.body.transactionId
  console.log(req.body);
  nrr = req.body.narration
  let action = req.body.action
  let query = nrr?{narration:nrr}:{}
  if(action=='approve'){
    let approveQuery = {status:"APPROVED",active:true,...query}
    Transaction.findOneAndUpdate({id:id},approveQuery,{},(err,updatedTransaction)=>{
      if(!err){
        let name = updatedTransaction.to.name
        let amt = updatedTransaction.amount
        User.findOneAndUpdate({username:name},{"$inc":{"balance":amt}},{},(err,doc)=>{
          if(!err){
            res.redirect('/admin/dashboard')
          }
          else {
            res.status(400).send(err)
          }
        })
      } else {
        res.send(err)
      }
    })

  } else if(action='reject') {
    let approveQuery = {status:"REJECTED",active:false,...query}
    Transaction.findOneAndUpdate({id:id},approveQuery,{},(err,updatedTransaction)=>{
      if(!err){
        res.redirect('/admin/dashboard/')
      } else {
        res.send(err)
      }
    })
  }
})
router.post('/bills/electricity/processing/',(req,res)=>{
    batchId = req.body.batchId
    if(batchId){
      BatchElectricity.findOne({id:batchId},(err,batch)=>{
        ProElecBill.find({id:{$in:batch.bills}},(err,bills)=>{
          info = {
            batchCount:batchId,
            user:req.user,
            bills:bills,
            query:"electricity",
            title:"Electricity bills"
          }
         res.render('admin/processingBills',{info:info})
        })   
       })
    } else {

      ProElecBill.find({},(err,bills)=>{
        info = {
          batchCount:batchId,
          user:req.user,
          bills:bills,
          query:"electricity",
          title:"Electricity bills"
        }
       res.render('admin/processingBills',{info:info})
      })
    }
    
})
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
  const {toDate,fromDate,toName,fromName,type,department,status} = req.body
  query = {}
  if(toDate || fromDate){
    query.date= {}
    toDate?query.date["$lte"] = new Date(req.body.toDate.split("-")).setHours(24):""
    fromDate?query.date["$gte"] = new Date(req.body.fromDate.split("-")).setHours(0, 0, 0, 0):""
  }
  status?query.status = status:""
  department?query.department = department:""
  type?query.type = type:""
  toName?query["to.name"] = toName:""
  fromName?query["from.name"] = fromName: ""
  console.log(query);
  Transaction.find(query,
    (err,docs)=>{
    var info = {
      user:req.user,
      type:type,
      status:status,
      department:department,
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
  user = new User(data)
  user.save((err)=>{
        if(!err){
          res.redirect('/admin/members/list/'+type)
        } else {
          res.redirect(`/admin/members/register?msg=${err}`)
        }
      })
})
router.post('/members/updateBalance/:type/:user',(req,res)=>{
  let amt = req.body.amount
  let type = req.params.type
  let pos_amt = Math.abs(amt)
  User.findOneAndUpdate({username:req.params.user},{"$inc":{"balance":amt}},{},(err,doc)=>{
    if(!err){
      res.redirect('/admin/members/list/'+type)
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
  var name = req.body.name
  var batch = []
  
  ElectricityBill.find({},(err,bills)=>{
   procBills = bills.map((e)=>{
      batch.push(e.id)
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
    console.log(batch);
    batch = new BatchElectricity({
      name:name,
      bills:batch
    })
    ProElecBill.insertMany(procBills,(err,newBills)=>{
        if(!err){
          ElectricityBill.deleteMany({},(err)=>{
            if(!err){
              batch.save(err=>{
                if(!err){
                  res.redirect('/admin/bills/electricity/processing/')
                }
              })
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
router.post('/bills/electricity/updateOne',(req,res)=>{
  const {id,status,receipt} = req.body
  ProElecBill.updateOne({id:id},{status:status,receiptNo:receipt},{},(err,doc)=>{
      if(!err){
        res.redirect('/admin/bills/electricity/processing/')
      } else {
        console.log(err);
      }
  })
})
module.exports = router









