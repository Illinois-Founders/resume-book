var express = require('express');
var passport = require('passport');
var Employer = require('../models/employer');
var router = express.Router();

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
	limits: { fileSize: 512*1024 }, // limit resumes to 512 kb
	storage: storage
});

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var passport = require('passport');
var UIUCID = require('illinois-directory');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Founders Resume Book', user: req.user });
});

router.get('/students', function(req, res, next){
	res.render('student-submission', {title: 'Student Resume Drop' });
});

// STUDENT SUBMISSION METHOD
var studentResumeField = upload.single('resume');
router.post('/students', studentResumeField, function (req, res, next) {
	// verify net ID exists, and against first and last name
	UIUCID(req.body.netid, function (err, details) {
		if (err) {
			console.log(req.body.netid + " not found");
			res.status(400).send("NetID not found");
		} else {
			if ((req.body.firstname.toUpperCase() !== details.firstname.toUpperCase()) || 
				(req.body.lastname.toUpperCase() !== details.lastname.toUpperCase())) { // case insensitive
				res.status(400).send("First name or last name doesn't match Illinois directory");
			} else {
				console.log("firstname:", req.body.firstname);
				console.log("lastname:", req.body.lastname);
				console.log("netid:", req.body.netid);
				console.log("gradyear:", req.body.gradyear);
				console.log("level:", req.body.level);
				console.log("lookingfor:", req.body.lookingfor);
				// Resume file as a buffer
				console.log("req.file:", req.file);
				res.send("OK!");
			}
		}
	});
});

router.get('/employers', function (req, res, next) {
	res.render('employer-login', {title: 'Employer Login Page' });
});

// EMPLOYER REGISTRATION METHOD
router.post('/employers/register', function (req, res) {
	Employer.register(new Employer({
		username: req.body.username,
		company_name: req.body.companyName
	}), req.body.password, function (err, account) {
		console.log("Registering new employer");
		account.company_name = req.body.companyName;
		if (err) {
			console.log("Error while trying to register!");
		}
		res.redirect('/');
	});
});

// EMPLOYER LOGIN METHOD
router.post('/employers', passport.authenticate('local'), function (req, res, next) {
	console.log("Employer logged in!");
	console.log(req.user);
	res.redirect('/');
});

router.get('/employers/dashboard', function (req, res) {
	console.log("ensure logged in, then let employers view dashboard");
});

// EMPLOYER LOGOUT METHOD
router.post('/employers/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

router.post('/students', function(req, res, next){
	console.log('post to students..')
	console.log(req);
	res.send(200);
});

module.exports = router;
