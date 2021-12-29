var router = require('express').Router();

router.use('/login', require('./login'));
router.use('/admin',require('./admin'))
router.use('/superDistributor',require('./superDistributor'))
// router.use('/distributor',require('./distributor'))
router.use('/retailer',require('./retailer'))


module.exports = router