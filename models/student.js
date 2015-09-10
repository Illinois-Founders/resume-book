var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  name: String,
  netid: { type: String, required: true, unique: true },
  gradyear: { type: String },
  seeking: { type: String },
  level: { type: String },
  resume: { type: String } ,
  created_at: { type: Date, default: Date.now }, 
  updated_at: { type: Date, default: Date.now }
});

var student = mongoose.model('Student', studentSchema);

module.exports = student;