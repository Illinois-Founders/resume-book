var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var employerSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String }
});

employerSchema.plugin(passportLocalMongoose);
var employer = mongoose.model('Employer', employerSchema);

module.exports = employer;