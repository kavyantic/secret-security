module.exports = function(app){





app.get('/dashboard/retailer/',(req,res)=>{
        if(req.isAuthenticated() && req.user.accountType==2){
          res.render('dashboard-retailer')
        }
        else {
          res.redirect('/login')
      
        }
      })
      
      

app.post('/login/distributor/',(req,res)=>{
        const {username,password}= req.body
        DistributorInfo.findOne({username:username},(err,foundDistributor)=>{
          if(err || foundDistributor == null){
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
                          res.redirect('/dashboard')
                       })
                    }
                 })
               }
             })
          }
        })
      })
      








}