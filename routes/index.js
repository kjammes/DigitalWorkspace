var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res)=> {
  res.json({
    username: req.body.name,
    email: req.body.email,
    test: "test",
  });
});

module.exports = router;