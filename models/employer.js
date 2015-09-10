var mongoose = require('mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var employerSchema = new Schema({
  firstname: String,
  secondname: String,
  email: {type: String, validate: [validator.isEmail, 'invalid email'] },
  company_name: {type: String, required: true, unique: true }, 
  username: { type: String, required: true, unique: true },
  password: { type: String }, 
  created_at: {type: Date, default: Date.now }, 
  expires : {type: Date}
});

employerSchema.plugin(passportLocalMongoose);
var employer = mongoose.model('Employer', employerSchema);

module.exports = employer;