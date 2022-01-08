var router = require('express').Router();
router.get('/',(req,res)=>{
    res.redirect('/login')
})
router.use('/login', require('./login'));
router.use('/admin',require('./admin'))
router.use('/superDistributor',require('./superDistributor'))
router.use('/distributor',require('./distributor'))
router.use('/retailer',require('./retailer'))
router.get('/departments',(req,res)=>{
    res.render('departments')
})
// router.get('*',(req,res)=>{
//     console.log("unknowe URL");
//     res.redirect('/login')
// })

module.exports = router