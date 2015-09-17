var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  firstname: { type: String, required: true, unique: true },
  lastname: { type: String, required: true, unique: true },
  netid: { type: String, required: true, unique: true },
  gradyear: { type: String },
  seeking: { type: String },
  level: { type: String },
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }
});

// resume URL is at https://founders-resumes.s3.amazonaws.com/{netid}.pdf

var student = mongoose.model('Student', studentSchema);

module.exports = student;