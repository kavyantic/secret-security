var router = require('express').Router();
var mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User')


router.param('msg', function(req, res, next,  msg) {
   req.msg = msg
   return next()
  });


router.param('alert', function(req, res, next,  alert) {
    req.alert = alert
    return next()
   });

router.use((req,res,next)=>{
    user = new User({
        username:req.body.username,
        password:req.body.password
    })
    req.user = user
    return next()
})
 
 

router.get('/',(req,res)=>{
    template_params = {
        msg:req.query.msg,
        redirect:req.query.red
    }
    res.render('login',{info:template_params})
})



router.post('/admin',(req,res)=>{
    req.user.accountType = "admin"
    red_url = req.body.redirect
    passport.authenticate("local")(req,res,function(err,user){
        if(err){
           res.redirect(`/login?msg=${err}`)
        } else {
            req.login(req.user,(err)=>{
                if(err){
                    res.redirect(`/login?msg=${err}`)
                } else {
                    res.redirect(red_url?`/${red_url}`:'/admin/dashboard')
                }
            })  
         }
    })
})
router.post('/superDistributor',(req,res)=>{
    req.user.accountType = "superDistributor"
    red_url = req.body.redirect
    req.login(req.user,(err)=>{
        if(err){
            res.redirect(`/login?msg=${err}`)
        } else {
            passport.authenticate("local")(req,res,function(err,user){
                if(err){
                    res.redirect(`/login?msg=${err}`)
                } else {
                    res.redirect(red_url?`/${red_url}`:'/superDistributor/dashboard')
                }  
            })
        }
    })
})
router.post('/distributor',(req,res)=>{
    req.user.accountType = "distributor"
    red_url = req.body.redirect
    req.login(req.user,(err)=>{
        if(err){
            res.redirect(`/login?msg=${err}`)
        } else {
            passport.authenticate("local")(req,res,function(err){
                console.log(err);
                res.redirect(red_url?`/${red_url}`:'/distributor/dashboard')
                
            })
        }
    })
})
router.post('/retailer',(req,res)=>{
    // req.user.accountType = "retailer"
    red_url = req.body.redirect
    req.login(req.user,(err)=>{
        if(err){
            res.redirect(`/login?msg=${err}`)
        } else {
            passport.authenticate("local")(req,res,function(err){
                console.log(err);
                res.redirect(red_url?`/${red_url}`:'/retailer/dashboard')
                
            })
        }
    })
})



module.exports = router;