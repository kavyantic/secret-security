const  {
    Retailer,
    RetailerInfo,
    DistributorInfo,
    AdminInfo,
    CustomerInfo
  } = require('../mongooseSchema')
const distributor = require('./distributor')


module.exports = function(app,passport){


app.get('/dashboard/admin/',(req,res)=>{
    if(req.isAuthenticated()){
     AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
       if(err){
        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
      }
      else {
        res.render('dashboard-admin')
      }
     })
    }
    else {
        res.redirect('/login')
    }
})
      



app.post('/login/admin/',(req,res)=>{
    const {username,password}= req.body
    AdminInfo.findOne({username:username},(err,foundAdmin)=>{
      if(err || foundAdmin == null){
        res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
    }
      else {
        const retailer = new Retailer({
          username:username,
          password:password,
          accountType:0
        })
        req.login(retailer,(err)=>{
          if(err){
            console.log(err);
            res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
          } else {
            passport.authenticate("local ")(req,res,function(){
              res.redirect('/dashboard/admin/')
            })
          }
        })
      }
    })
   
  })
  
////////////////////////////////         API            ////////////////////////////////////////



///////////////////////////////       Distrubutor       ////////////////////////////
app.route('/admin/distributor/:username')
.get((req,res)=>{
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
       DistributorInfo.find((err,doc)=>{
         res.send(doc)
       })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
.post()
.patch((req,res)=>{
  const distributor = req.params.username
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
      if(req.body.password){
        Retailer.findOne({username:retailer},(err,doc)=>{
          if(err || !doc){
            res.send(err)
          }
          else{
            doc.setPassword(req.body.password,(err)=>{
              if(err){
                res.send(err)
              }
            })
          }
        })   
      }
        DistributorInfo.updateOne({username:distributor}, {$set:req.body}, {new:true}, (error, doc) => {
          if(err){
            console.log(err);
            res.send(err)
          }
          else {
            console.log(doc);
            res.send(doc)
          }
        });;
     }
    })
   }  
   else {
       res.redirect('/login')
   }
})
.delete((req,res)=>{
  distributorName = req.params.username

  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
      Retailer.deleteOne({username:distributorName},
        (err)=>{
          if(err){
            res.send(err)
          }
          else {
            DistributorInfo.deleteOne({username:distributorName},(err)=>{
              if(err){
                res.send(err)
              }
              else {
                 res.sendStatus(200)
              }
            })
          }
    
      })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
///////////////////////////////       Distrubutor       /////////////////////////////////////////////////////////////////////////////////////














///////////////////////////////       Retailer       /////////////////////////////////////////////////////////////////////////////////////

app.route('/admin/retailer/:username')
.get((req,res)=>{
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
       RetailerInfo.find((err,doc)=>{
         res.send(doc)
       })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
.post()
.patch((req,res)=>{
  const retailer = req.params.username
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
       if(req.body.password || req.body.username){

        Retailer.findOne({username:retailer},(err,doc)=>{
          if(err || !doc){
            res.send(err)
          }
          else{
            doc.setPassword(req.body.password,(err)=>{
              if(err){
                res.send(err)
              }
            })
          }
        })
       }
        RetailerInfo.updateOne({username:retailer}, {$set:req.body}, {new:true}, (error, doc) => {
          if(err){
            console.log(err);
            res.send(err)
          }
          else {
            console.log(doc);
            res.send(doc)
          }
        });;
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
.delete((req,res)=>{
  retailerName = req.params.username

  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
      Retailer.deleteOne({username:retailerName},
        (err)=>{
          if(err){
            res.send(err)
          }
          else {
            RetailerInfo.deleteOne({username:retailerName},(err)=>{
              if(err){
                res.send(err)
              }
              else {
                 res.sendStatus(200)
              }
            })
          }
    
      })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
///////////////////////////////       Retailer       /////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////       Customer       /////////////////////////////////////////////////////////////////////////////////////

app.route('/admin/customer/')
.get((req,res)=>{
  if(req.isAuthenticated()){
    AdminInfo.findOne({username:req.user.username},(err,foundAdmin)=>{
      if(err){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
        CustomerInfo.find((err,doc)=>{
         res.send(doc)
       })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
///////////////////////////////       Customer       /////////////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  
 

  








}