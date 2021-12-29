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

// const Transaction = mongoose.model('Transaction')

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
   res.render('admin/updateMember',{info:info})
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
  } else  if(type==="superdistributor"){
    model = new SuperDistributor(req.body)
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

router.post('/bills/electricity/uploadStatus')




module.exports = router



// app.post('/login/admin/',(req,res)=>{
//     const {username,password}= req.body
//     AdminInfo.findOne({username:username},(err,foundAdmin)=>{
//       if(err || foundAdmin == null){
//         res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//       else {
//         const retailer = new Retailer({
//           username:username,
//           password:password,
//           accountType:0
//         })
//         req.login(retailer,(err)=>{
//           if(err){
//             console.log(err);
//             res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//           } else {
//             passport.authenticate("local ")(req,res,function(){
//               res.redirect('/dashboard/admin/')
//             })
//           }
//         })
//       }
//     })
   
//   })
  
// ////////////////////////////////         API            ////////////////////////////////////////

// app.get('/dashboard/admin/members/',(req,res)=>{
//   if(req.isAuthenticated()){
//    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//      if(err || !foundAdmin){
//       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//     else {
//       DistributorInfo.find((err,distributors)=>{
//         if(!err){
//           RetailerInfo.find((err,retailers)=>{
//             if(!err){
//               res.render('admin/members-table',{retailers:retailers,distributors:distributors})
//             }
//             else{
//               res.send(err)
//             }
//           })
//         }
//         else {
//           res.send(err)
//         }
//       })
//     }
//    })
//   }
//   else {
//       res.redirect('/login')
//   }
// })


// app.get('/dashboard/admin/members/register',(req,res)=>{
//   query = req.query.query
//   alert = req.query.alert 
//   if(req.isAuthenticated()){
//    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//      if(err || !foundAdmin){
//       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//     else {
//       res.render('admin/create-member',{msg:query,alert:alert})
//     }
//    })
//   }
//   else {
//       res.redirect('/login')
//   }
// })


// app.post('/admin/members/register/retailer',(req,res)=>{
//   if(req.isAuthenticated()){
//    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//      if(err || !foundAdmin){
//       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//     else {
//       const {username, password, email, phone, sponser } = req.body
//       var retailerInfo = new RetailerInfo({
//         username:username,
//         password:password,
//         email:email,
//         phone:phone,
//         sponserId:sponser,
//         billSubmitted:[]
//       })
//       retailerInfo.save((err,doc)=>{
//         if(!err){
//           retailer = new Retailer({
//             username:username,
//             password:password,
//             accountType:2
//           })
//           retailer.save((err,doc)=>{
//             if(!err && doc){

//               res.redirect(`/dashboard/admin/members/register?alert=${alert}`)
//             }
//             else {
//               res.redirect(`/dashboard/admin/members/register?query=${err?err:"Something went wrong"}`)
//             }
//           })
//         }
//         else {
//           res.redirect(`/dashboard/admin/members/register?query=${err?err:"Something went wrong"}`)
//         }
//       })
//     }
//    })
//   }
//   else {
//       res.redirect('/login')
//   }
// })



// app.post('/admin/members/register/distributor',(req,res)=>{
//   if(req.isAuthenticated()){
//    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//      if(err || !foundAdmin){
//       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//     else {
//       const {username, password, email, phone} = req.body
//       var distributorInfo = new DistributorInfo({
//         username:username,
//         password:password,
//         email:email,
//         phone:phone,
//         retailers:[]
//       })
//       distributorInfo.save((err,doc)=>{
//         if(!err){
//           retailer = new Retailer({
//             username:username,
//             password:password,
//             accountType:1
//           })
//           retailer.save((err,doc)=>{
//             if(!err && doc){

//               res.redirect(`/dashboard/admin/members/register?alert=${alert}`)
//             }
//             else {
//               res.redirect(`/dashboard/admin/members/register?query=${err?err:"Something went wrong"}`)
//             }
//           })
//         }
//         else {
//           res.redirect(`/dashboard/admin/members/register?query=${err?err:"Something went wrong"}`)
//         }
//       })
//     }
//    })
//   }
//   else {
//       res.redirect('/login')
//   }
// })





// ///////////////////////////////       Distrubutor       ////////////////////////////
// app.route('/admin/distributor/:username')
// .get((req,res)=>{
//   distributorName = req.params.distributor
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//        DistributorInfo.findOne({username:distributorName},(err,doc)=>{
//          res.send(doc)
//        })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })
// .post((req,res)=>{
//   const {username, password, email, phone} = req.body
//     if(req.isAuthenticated()){
//       AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//         if(err){
//          res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//        }
//        else {
//         DistributorInfo.findOne({username:distributor},(err,foundDistributor)=>{
//           if(err || !foundDistributor){
//             console.log(err);
//             res.send(err?err:"No distributor with this username")
//           }
//           else {
//             console.log(foundDistributor);
//             var retailerInfo = new RetailerInfo({
//               username:username,
//               password:password,
//               email:email,
//               phone:phone,
//               distributor:foundDistributor.id,
//               billSubmitted:[]
//             })
//             retailerInfo.save((err,doc)=>{
//               if(err){
//                 console.log("validation error");
//                 res.send(err)
//               } else {
//                 foundDistributor.retailers.push(doc.id)
//                 foundDistributor.save()
//                 retailer = new Retailer({
//                   username:username,
//                   password:password,
//                   accountType:2
//                 }).save((err,doc)=>{
//                   if(err || !doc){
//                     res.send(err?err:"Something went wrong")
//                   }
//                   else {
//                     res.status(200).send(doc)
//                   }
//                 }) 
//               }
//             })
//           }
//         })
//        }
//       })
//      }
//      else {
//          res.redirect('/login')
//      }
// })
// .put((req,res)=>{
//   const distributor = req.params.username
//   if(req.isAuthenticated()){
//    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//      if(err){
//       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//     }
//     else {
//       RetailerInfo.findOne({username:req.body.username},(err,foundRetailer=>{
//         if(err){
//           res.send(err)
//         }
//         else {
//           DistributorInfo.updateOne({username:distributor},{$push:{retailers:foundRetailer._id}},{new:true},(err,updatedDoc)=>{
//             res.send(updatedDoc)
//           })
//         }
      

//       }))
//     }
//    })
//   }
//   else {
//       res.redirect('/login')
//   }
// })
// .patch((req,res)=>{
//   const distributor = req.params.username
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//       if(req.body.password){
//         Retailer.findOne({username:distributor},(err,doc)=>{
//           if(err || !doc){
//             res.send(err)
//           }
//           else{
//             doc.setPassword(req.body.password,(err)=>{
//               if(err){
//                 res.send(err)
//               }
//             })
//           }
//         })   
//       }
//         DistributorInfo.updateOne({username:distributor}, {$set:req.body}, {new:true}, (error, doc) => {
//           if(err){
//             console.log(err);
//             res.send(err)
//           }
//           else {
//             console.log(doc);
//             res.send(doc)
//           }
//         });;
//      }
//     })
//    }  
//    else {
//        res.redirect('/login')
//    }
// })
// .delete((req,res)=>{
//   distributorName = req.params.username

//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//       Retailer.deleteOne({username:distributorName},
//         (err)=>{
//           if(err){
//             res.send(err)
//           }
//           else {
//             DistributorInfo.deleteOne({username:distributorName},(err)=>{
//               if(err){
//                 res.send(err)
//               }
//               else {
//                  res.sendStatus(200)
//               }
//             })
//           }
    
//       })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })




// ///////////////////////////////       Retailer       /////////////////////////////////////////////////////////////////////////////////////

// app.route('/admin/retailer/:username')
// .get((req,res)=>{
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//        RetailerInfo.find((err,doc)=>{
//          res.send(doc)
//        })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })
// .post((req,res)=>{
//   const {username, password, email, phone, distributor} = req.body
//     if(req.isAuthenticated()){
//       AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//         if(err){
//          res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//        }
//        else {
//         DistributorInfo.findOne({username:distributor},(err,foundDistributor)=>{
//           if(err || !foundDistributor){
//             console.log(err);
//             res.send(err?err:"No distributor with this username")
//           }
//           else {
//             console.log(foundDistributor);
//             var retailerInfo = new RetailerInfo({
//               username:username,
//               password:password,
//               email:email,
//               phone:phone,
//               distributor:foundDistributor.id,
//               billSubmitted:[]
//             })
//             retailerInfo.save((err,doc)=>{
//               if(err){
//                 console.log("validation error");
//                 res.send(err)
//               } else {
//                 foundDistributor.retailers.push(doc.id)
//                 foundDistributor.save()
//                 retailer = new Retailer({
//                   username:username,
//                   password:password,
//                   accountType:2
//                 }).save((err,doc)=>{
//                   if(err || !doc){
//                     res.send(err?err:"Something went wrong")
//                   }
//                   else {
//                     res.status(200).send(doc)
//                   }
//                 }) 
//               }
//             })
//           }
//         })
//        }
//       })
//      }
//      else {
//          res.redirect('/login')
//      }
// })
// .put((req,res)=>{

// })
// .patch((req,res)=>{
//   const retailer = req.params.username
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//        if(req.body.password || req.body.username){

//         Retailer.findOne({username:retailer},(err,doc)=>{
//           if(err || !doc){
//             res.send(err)
//           }
//           else{
//             doc.setPassword(req.body.password,(err)=>{
//               if(err){
//                 res.send(err)
//               }
//             })
//           }
//         })
//        }
//         RetailerInfo.updateOne({username:retailer}, {$set:req.body}, {new:true}, (error, doc) => {
//           if(err){
//             console.log(err);
//             res.send(err)
//           }
//           else {
//             console.log(doc);
//             res.send(doc)
//           }
//         });;
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })
// .delete((req,res)=>{
//   retailerName = req.params.username

//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {
//       Retailer.deleteOne({username:retailerName},
//         (err)=>{
//           if(err){
//             res.send(err)
//           }
//           else {
//             RetailerInfo.deleteOne({username:retailerName},(err)=>{
//               if(err){
//                 res.send(err)
//               }
//               else {
//                  res.sendStatus(200)
//               }
//             })
//           }
    
//       })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })


// ///////////////////////////////       Customer       /////////////////////////////////////////////////////////////////////////////////////

// app.route('/dashboard/admin/bills/new')
// .get((req,res)=>{
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err || !foundAdmin){
//        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
//      }
//      else {

//         CustomerInfo.find((err,bills)=>{
//          res.render('admin/bill-submitted',{bills:bills,alert:""})
//        })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })



// app.route('/dashboard/admin/bills/processing')
// .get((req,res)=>{
//   if(req.isAuthenticated()){
//     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
//       if(err  || !foundAdmin){
//        res.redirect(`/register?query=${err ?err:"Somthing went wrong"}`)
//      }
//      else {

//         CustomerInfo.find((err,bills)=>{
//          res.render('admin/bill-submitted',{bills:bills,alert:""})
//        })
//      }
//     })
//    }
//    else {
//        res.redirect('/login')
//    }
// })


// ///////////////////////////////       Customer       /////////////////////////////////////////////////////////////////////////////////////


//   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  
 

  








