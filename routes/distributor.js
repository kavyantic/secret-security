const  {
  Retailer,
  RetailerInfo,
  DistributorInfo,
  AdminInfo,
  CustomerInfo
} = require('../mongooseSchema')





module.exports = function(app,passport){





app.get('/dashboard/distributor/',(req,res)=>{
  if(req.isAuthenticated()){
    DistributorInfo.findOne({username:req.user.username},(err,foundDistributor)=>{
    if(err || !foundDistributor){
       res.redirect(`/lodin?query=${err?err:"Somthing went wrong"}`)
     }
     else {
       res.render('dashboard-distributor')
     }
    })
   }
   else {
       res.redirect('/login')
   }
})
      
      

app.post('/login/distributor/',(req,res)=>{
        const {username,password}= req.body
        DistributorInfo.findOne({username:username},(err,foundDistributor)=>{
          if(err || foundDistributor == null){
            res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
          }
          else { 
            const retailer = new Retailer({
                username:username,
                password:password,
                accountType:1
              })
            req.login(retailer,(err)=>{
              if(err){
                console.log(err);
                res.redirect('/register',{msg:err})
              } else {
                passport.authenticate("local ")(req,res,function(){
                  res.redirect('/dashboard/distributor/')
                })
              }
            })
          }
        })
      })



app.post('/register/distributor',function(req,res){
        const {username, password, email, phone} = req.body
        var distributorInfo = new DistributorInfo({
          username:username,
          email:email,
          phone:phone,
          retailers:[]
        })
        distributorInfo.validate((err)=>{
          if(err){
            console.log("validation error");
            res.redirect(`/register?query=${err}`)
      
          } else {
            Retailer.register({username:username,accountType:"1"},password,(err)=>{
              if(err){
                console.log(err);
                res.redirect(`/register?query=${err.message}`)
              }
              else {
                distributorInfo.save((err,doc)=>{
                  if(err){
                    console.log(err);
                    res.redirect(`/register?query=${err}`)
                  } else {
                          passport.authenticate('local')(req,res,()=>{
                            res.redirect('/dashboard/distributor/')
                        })
                    }
                 })
               }
             })
          }
        })
      })
      
////////////////////////////////         API            ////////////////////////////////////////
 

app.get('/distributor/retailer/info',(req,res)=>{
  if(req.isAuthenticated()){
    DistributorInfo.findOne({username:req.user.username},(err,foundDistributor)=>{
    if(err || !foundDistributor){
       res.redirect(`/register?query=${err?err:"Somthing went wrong"}`)
     }
     else {
       RetailerInfo.find({ '_id': { $in: foundDistributor.retailers}},(err,docs)=>{
         res.send(docs)
       })
     }
    })
   }
   else {
       res.redirect('/login')
   }
})





}