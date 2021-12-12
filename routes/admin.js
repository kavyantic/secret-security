const {
    Retailer,
    RetailerInfo,
    DistributorInfo,
    AdminInfo,
    CustomerInfo
  } = require('../app.js')

module.exports = function(app){





app.get('/dashboard/admin/',(req,res)=>{
    if(req.isAuthenticated() && req.user.accountType==0){
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
        res.redirect('/register',{msg:err?err:"Somthing went wrong"})
      }
      else {
        const retailer = new Retailer({
          username:username,
          password:password
        })
        req.login(retailer,(err)=>{
          if(err){
            console.log(err);
            res.redirect('/register',{msg:err})
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