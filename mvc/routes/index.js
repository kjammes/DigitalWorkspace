const express = require('express');
const router = express.Router();

const middleware = require('./middleware/middleware')
const routerCtrl = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Login Register
router.post('/login', routerCtrl.loginUser );
router.post('/register', routerCtrl.registerUser );

//location services
router.post('/get-location',middleware.authorize , routerCtrl.returnLocation );

//handling messages
router.post('/send-message/:to', middleware.authorize, routerCtrl.sendMessage);

//handling about and skills
router.post('/get-about-skills', middleware.authorize , routerCtrl.getUserData);
router.post('/update-about', middleware.authorize , routerCtrl.updateAboutSection);

//handling provider switch
router.post('/switch-to-provider', middleware.authorize, routerCtrl.switchToProvider);

//handling getting provider or consumer
router.post('/get-consumer-list', middleware.authorize, routerCtrl.getConsumersList);
router.post('/get-provider-list', middleware.authorize, routerCtrl.getProvidersList);

//for testing only
router.delete('/all' , routerCtrl.deleteAllUsers )
router.get('/all' , routerCtrl.getAllUsers )

module.exports = router;