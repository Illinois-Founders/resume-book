var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Founders Resume Book' });
});

router.get('/students', function (req, res, next) {
	res.render('index', {title: 'Student Login Page' });
});

// STUDENT LOGIN METHOD
router.post('/students', passport.authenticate('saml'), function (req, res, next) {
	console.log("Student logged in!");
	console.log(req.user);
	// REGISTER IF NECESSARY
	res.redirect('/');
});

router.get('/employers', function (req, res, next) {
	res.render('employer-login', {title: 'Employer Login Page' });
});

// EMPLOYER LOGIN METHOD
router.post('/employers', passport.authenticate('local'), function (req, res, next) {
	console.log("Employer logged in!");
	console.log(req.user);
	res.redirect('/');
});

module.exports = router;
