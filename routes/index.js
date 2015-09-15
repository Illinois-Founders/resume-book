var express = require('express');
var request = require('request');
var passport = require('passport');
var Employer = require('../models/employer');
var router = express.Router();

// config
var config = {};
if (process.env.G_RECAPTCHA_SECRET) {
	// production
	config.G_RECAPTCHA_SECRET = process.env.G_RECAPTCHA_SECRET;
} else {
	// development
	config = require('../config');
}

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
	limits: { fileSize: 512*1024 }, // limit resumes to 512 kb
	storage: storage
});

var AWS = require('aws-sdk');
if (!process.env.AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
	// For development environment
	// IMPORTANT: keys should be stored under a profile named 'resumebook' if env vars aren't set
	var credentials = new AWS.SharedIniFileCredentials({profile: 'resumebook'});
	AWS.config.credentials = credentials;
}
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
	// first verify recaptcha
	var grRes = req.body["g-recaptcha-response"];
	var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.G_RECAPTCHA_SECRET + "&response=" + grRes + "&remoteip=" + req.connection.remoteAddress;
	request.post(url, function (err, httpResponse, body) {
		if (err) {
			res.status(500).send("Error in processing recaptcha: " + err);
		} else {
			// check if success
			var grServerRes = JSON.parse(body);
			if (grServerRes.success) {
				// success
				// verify net ID exists, and against first and last name
				UIUCID(req.body.netid, function (err, details) {
					if (err) {
						console.log(req.body.netid + " not found");
						res.status(400).send("NetID not found.");
					} else {
						if ((req.body.firstname.toUpperCase() !== details.firstname.toUpperCase()) || 
							(req.body.lastname.toUpperCase() !== details.lastname.toUpperCase())) { // case insensitive
							res.status(400).send("First name or last name doesn't match Illinois directory records.");
						} else {
							// TODO: change
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
			} else {
				// failure
				var errorCodes = grServerRes["error-codes"];
				console.log("User at " + req.connection.remoteAddress + " failed recaptcha: " + errorCodes);
				res.status(400).send("Resume submission failed. Error codes: " + errorCodes);
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
