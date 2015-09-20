var express = require('express');
var request = require('request');
var passport = require('passport');
var Student = require('../models/student');
var Employer = require('../models/employer');
var router = express.Router();

// environment variables config
var config = {};
if (process.env.G_RECAPTCHA_SECRET) {
	// production
	config.G_RECAPTCHA_SECRET = process.env.G_RECAPTCHA_SECRET;
} else {
	// development
	config = require('../config');
}

// multer config
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
	limits: { fileSize: 512*1024 }, // limit resumes to 512 kb
	storage: storage
});

// AWS S3 config
var AWS = require('aws-sdk');
if (!process.env.AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
	// For development environment
	// IMPORTANT: keys should be stored under a profile named 'resumebook' if env vars aren't set
	var credentials = new AWS.SharedIniFileCredentials({profile: 'resumebook'});
	AWS.config.credentials = credentials;
	console.log("Credentials:", credentials); //DEBUG
}
var s3 = new AWS.S3();

// mongoose config
var mongoose = require('mongoose');
var db = mongoose.connection;

// misc requires
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
							updateInfoAndResume(req, function (error) {
								if (error) {
									console.log("Error while updating info and resume for " + req.body.netid);
									res.status(500).send(error);
								} else {
									console.log("Successfully updated info and resume for " + req.body.netid);
									res.send("Successfully updated info and resume!");
								}
							});
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

/* Helper method for interacting with Mongo and AWS in POST /students */
var updateInfoAndResume = function (req, callback) {
	// restrict req.file.mimetype to application/pdf
	if (!req.file) {
		console.log("req.file is not a resume");
		callback("Resume was not provided. Try again.");
	} else if (req.file.mimetype !== "application/pdf") {
		console.log("Resume is not a PDF file");
		callback("Resume should be a PDF file. Try again.");
	} else {
		// Bucket name is founders-resumes
		// create updated info object and query
		var updatedInfo = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			firstname_search: req.body.firstname.toUpperCase(),
			lastname_search: req.body.lastname.toUpperCase(),
			netid: req.body.netid,
			gradyear: req.body.gradyear,
			seeking: req.body.lookingfor,
			level: req.body.level,
			updated_at: new Date()
		};
		var queryInfo = {netid: req.body.netid};
		var options = {upsert: true, multi: false};
		// add info if not exists, else update info
		Student.update(queryInfo, updatedInfo, options, function (err, rawResponse) {
			if (err) {
				console.log("Error updating info for " + req.body.netid + ": " + err);
				callback("There was an error updating your info.");
			} else {
				console.log("Successfully updated info for " + req.body.netid);
				// update resume
				var params = {
					Bucket: "founders-resumes",
					Key: req.body.netid + ".pdf", // resume filename can be inferred
					Body: req.file.buffer,
					ACL: 'public-read',
					ContentType: 'application/pdf'
				};
				s3.putObject(params, function (err) {
					if (err) {
						console.log("Error uploading resume for " + req.body.netid + ": " + err);
						callback("There was an error uploading your resume.");
					} else {
						console.log("Successfully uploaded resume for " + req.body.netid);
						callback();
					}
				});
			}
		});
	}
};

/* API method for getting students */
router.get('/students/search', function (req, res, next) {
	// 1. pagination is front end's responsibility
	// 2. firstname and lastname searches are case insensitive
	// TODO: ensure authentication?
	// construct query
	var query = {};
	if (req.query.firstname) query.firstname_search = new RegExp(req.query.firstname.toUpperCase());
	if (req.query.lastname) query.lastname_search = new RegExp(req.query.lastname.toUpperCase());
	if (req.query.netid) query.netid = req.query.netid;
	if (req.query.gradyear) {
		query.gradyear = {};
		query.gradyear["$in"] = req.query.gradyear; // allow querying for multiple grad years
	}
	if (req.query.lookingfor) {
		query.seeking = {};
		query.seeking["$in"] = req.query.lookingfor; // allow querying for multiple seekings
	}
	if (req.query.level) {
		query.level = {};
		query.level["$in"] = req.query.level; // allow querying for multiple levels
	}
	// sort
	var sort = req.query.sort || null;
	Student.find(query, '-_id firstname lastname netid gradyear seeking level', {sort: sort}, function (err, docs) {
		if (err) {
			res.status(500).send("Error fetching results from database.");
		} else {
			// no cache
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');
			res.send(docs);
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
	// TODO: ensure logged in, then view dashboard
	res.render('employer-view', {title: "Employers' Dashboard"});
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
