const router = require('express').Router();
const { query } = require('express');
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
var templatePath = 'superDistributor'
var accountType = templatePath.toLowerCase()
// const Transaction = mongoose.model('Transaction')
const passport = require('passport');

// router.param('type',(req,res,next,type)=>{
//   if(type.toLowerCase()==="retailer"){
//     req.model = Retailer
//   } else if(type.toLowerCase()==="distributor"){
//     req.model = Distributor
//   } else  if(type.toLowerCase()==="superdistributor"){
//     req.model = SuperDistributor
//   }
//   else {
//    return next(null)
//   }
//   return next()
// })
router.use((req,res,next)=>{
  if(req.isAuthenticated() && req.user.accountType===accountType){
      return next()
  } else {
      if(req.method==="GET"){
      res.redirect(`/login?msg=Please login again&red=${templatePath}/${req.url}`) 
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
      res.render(`${templatePath}/dashboard`,{info:info})
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
     res.render(`${templatePath}/newBills`,{info:info})
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
     res.render(`${templatePath}/processingBills`,{info:info})
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
     res.render(`${templatePath}/newBills`,{info:info})
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
     res.render(`${templatePath}/processingBills`,{info:info})
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
     res.render(`${templatePath}/listMembers`,{info:info})
    })
  })
})
router.get('/members/register',(req,res)=>{
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    info = {
      user:foundAdmin
    }
   res.render(`${templatePath}/registerMember`,{info:info})
  })
})
router.get('/members/update/:type/:user',(req,res)=>{
  let user = req.params.user
  let type = req.params.type.toLowerCase()
  Admin.findOne({username:req.user.username},(err,foundAdmin)=>{
    if(type==="retailer"){
      Retailer
    } else if(type==="distributor"){
      Distributor
    } else  if(type==="superdistributor"){
      SuperDistributor
    }
    else {
    }
    info = {
      user:foundAdmin
    }
   res.render(`${templatePath}/updateMember`,{info:info})
  })
})


// Posts //



router.post('/members/register/:type',(req,res)=>{
  let type = req.params.type.toLowerCase()
  let data = req.body
  console.log(data);
  data.sponseredBy = "Admin"
  if(type==="retailer"){
    model = new Retailer(req.body)
  } else if(type==="distributor"){
    model = new Distributor(req.body)
  }
  else {
    res.status(401).send({err:"Invalid Type of User"})
  }
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

module.exports = router