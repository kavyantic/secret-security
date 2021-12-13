const  {
    Retailer,
    RetailerInfo,
    DistributorInfo,
    AdminInfo,
    CustomerInfo
  } = require('../mongooseSchema')


module.exports = function(app,passport){


app.get('/dashboard/admin/',(req,res)=>{
    console.log(req.user);
    if(req.isAuthenticated() && req.user.accountType ==0 ){
         res.render('dashboard-admin')
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
  
  

  









}