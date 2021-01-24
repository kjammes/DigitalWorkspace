const express = require('express');
const router = express.Router();

const middleware = require('./middleware/middleware')
const routerCtrl = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', routerCtrl.loginUser );
router.post('/register', routerCtrl.registerUser );

//http://localhost:3000/login 

// router.post('/add', middleware.authorize , (req,res) => {
//   res.json({
//     num1: 4,
//     num2: 4,
//     res: 8
//   });
// } )


//for testing only
router.delete('/all' , routerCtrl.deleteAllUsers )
router.get('/all' , routerCtrl.getAllUsers )

module.exports = router;