var express = require('express');
var passport = require('passport');
var Employer = require('../models/employer');
var router = express.Router();

var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Founders Resume Book' });
});

router.get('/students', function (req, res, next) {
	console.log("students submit resumes here");
});

router.get('/employers', function (req, res, next) {
	res.render('employer-login', {title: 'Employer Login Page' });
});

// EMPLOYER REGISTRATION METHOD
router.post('/employers/register', function (req, res) {
	Employer.register(new Employer({username: req.body.username}), req.body.password, function (err, account) {
		if (err) {
			return res.render('register', {account: account});
		}
	});
});

// EMPLOYER LOGIN METHOD
router.post('/employers', passport.authenticate('local'), function (req, res, next) {
	console.log("Employer logged in!");
	console.log(req.user);
	res.redirect('/');
});

// EMPLOYER LOGOUT METHOD
router.post('/employers/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
