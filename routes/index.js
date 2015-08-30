var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Founders Resume Book' });
});

router.get('/students', function(req, res, next){
	res.render('index', {title: 'Student Login Page' });
});

router.get('/employers', function(req, res, next){
	res.render('employer-login', {title: 'Employer Login Page' });
});

module.exports = router;
