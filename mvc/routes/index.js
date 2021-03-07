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

//handling about and skills
router.post('/get-about-skills', middleware.authorize , routerCtrl.getUserData);
router.post('/update-about', middleware.authorize , routerCtrl.updateAboutSection);

//handling provider switch
router.post('/switch-to-provider', middleware.authorize, routerCtrl.switchToProvider);

//handling getting provider or consumer
router.post('/get-consumer-list', middleware.authorize, routerCtrl.getConsumersList);
router.post('/get-provider-list', middleware.authorize, routerCtrl.getProvidersList);

//Handling posts
router.post("/create-post", middleware.authorize, routerCtrl.createPost);
router.get("/get-posts-list", middleware.authorize, routerCtrl.getPosts);
// router.delete("/delete-post", middleware.authorize, routerCtrl.getUserNameById);

//Handling search
router.get("/get-search-results", middleware.authorize, routerCtrl.getSearchResults);

//helper routes
router.post('/get-name-by-id', middleware.authorize, routerCtrl.getUserNameById);


//for testing only
router.delete('/all' , routerCtrl.deleteAllUsers )
router.get('/all' , routerCtrl.getAllUsers )

module.exports = router;