var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  name: String,
  netid: { type: String, required: true, unique: true },
  grad_year: { type: String },
  seeking: { type: String },
  level: { type: String },
  resume: { type: String } ,
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});

var student = mongoose.model('Student', userSchema);

module.exports = student;