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

router.param('type',(req,res,next,type)=>{
  type = type.toLowerCase()
  if(type==="retailer"){
    req.model = Retailer
  } else if(type==="distributor"){
    req.model = Distributor
  } else  if(type==="superdistributor"){
    req.model = SuperDistributor
  }
  else {
   return next(null)
  }
  return next()
})
router.use((req,res,next)=>{
  if(req.isAuthenticated() && req.user.accountType==="admin"){
      return next()
  } else {
    console.log(req.method);
      if(req.method==="GET"){
        res.redirect(`/login?msg=Please login again&red=admin/${req.url}`)
      }
      else {
        res.redirect(`/login?msg=Please login again`)
      }
  }
  
})
router.get('/dashboard',(req,res)=>{
     Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
       info = {
         user:foundAdmin
       }
      res.render('admin/dashboard',{info:info})
     })
})
router.get('/bills/electricity/new',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    ElectricityBill.find({},(err,bills)=>{ 
      info = {
        user:foundAdmin,
        bills:bills,
        query:"electiricity",
        title:"Electricity bills"
      }
     res.render('admin/newBills',{info:info})
    })
  })
})
router.get('/bills/electricity/processing/',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    ProElecBill.find({},(err,bills)=>{
      info = {
        user:foundAdmin,
        bills:bills,
        query:"electricity",
        title:"Electricity bills"
      }
     res.render('admin/processingBills',{info:info})
    })
   })
})
router.get('/bills/water/new',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    WaterBill.find({},(err,bills)=>{ 
      info = {
        user:foundAdmin,
        bills:bills,
        query:"water",
        title:"Water bills"
      }
     res.render('admin/newBills',{info:info})
    })
  })
})
router.get('/bills/water/processing',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    ProWaterBill.find({},(err,bills)=>{
      info = {
        user:foundAdmin,
        bills:bills,
        query:"water",
        title:"Water bills"
      }
     res.render('admin/processingBills',{info:info})
    })
   })
})
router.get('/members/list',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    Promise.all([
      Retailer.find(),
      Distributor.find(),
      SuperDistributor.find()
    ]).then((result)=>{
      info = {
        user:foundAdmin,
        retailers:result[0],
        distributors:result[1],
        superDistributor:result[2]
      }
     res.render('admin/listMembers',{info:info})
    })
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
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    info = {
      user:foundAdmin
    }
   res.render('admin/registerMember',{info:info})
  })
})
router.get('/members/update/:type/:user',(req,res)=>{
  let user = req.params.user
  req.model.findOne({username:user},(err,foundMember)=>{
    User.findOne({username:user},(err,foundAuth)=>{
      info = {
        userType:req.params.type,
        userName:user,
        user:req.user,
        member:foundMember,
        auth:foundAuth
      }
      res.render('admin/updateMember',{info:info})
    })
  })
})
router.post('/members/update/:type/:user',(req,res)=>{
  let user = req.params.user
  req.model.updateOne({username:user},req.body,{new:true},(err,updatedMember)=>{
    if(!err){
      User.updateOne({username:user},req.body,{},(err,updateAuth)=>{
        if(!err){
          res.redirect('/admin/members/list')
        } else {
           console.log(err);
        }
      })
    } else {
      console.log(err);
    }
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


router.post('/transactions',(req,res)=>{
  const {toDate,fromDate,toName,fromName} = req.body
  query = {}
  if(toDate||fromDate){
    query.date= ""
    toDate?query.date["$lte"] = new Date(req.body.toDate.split("-")).setHours(24):""
    fromDate?query.date["$gte"] = new Date(req.body.fromDate.split("-")).setHours(0, 0, 0, 0):""
  }
  toName?query["to.name"] = toName:""
  fromName?query["from.name"] = fromName: ""
  console.log(query);
  Transaction.find(query,
    (err,docs)=>{
    console.log(req.body);
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
  console.log(data);
  data.sponseredByName = "Admin"
  data.sponseredBy = req.user._id
  model = new req.model(data)
  user = new User({
    accountType:type,
    username:req.body.username,
    password:req.body.password
  })
  user.save((err,doc)=>{
    if(!err){
      model.save((err)=>{
        if(!err){
          res.status(200).send({msg:"Successfull"})
        } else {
          res.status(400).send({err:err})
        }
      })
    } else{
      console.log(err);
      res.status(400).send({err:"Username already in use"})
    }
  })
})

router.post('/members/updateBalance/:type/:user',(req,res)=>{
  let amt = req.body.amount
  let pos_amt = Math.abs(amt)
  req.model.findOneAndUpdate({username:req.params.user},{"$inc":{"balance":amt}},{},(err,doc)=>{
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

router.post('/bills/electricity/uploadStatus',(req,res)=>{
  console.log((req.body));
  res.send((req.body))
})

module.exports = router









