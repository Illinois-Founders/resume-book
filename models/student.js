var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  firstname: { type: String, required: true, unique: false },
  lastname: { type: String, required: true, unique: false },
  firstname_search: { type: String, required: true, unique: false },
  lastname_search: { type: String, required: true, unique: false },
  netid: { type: String, required: true, unique: true },
  gradyear: { type: String },
  major: { type: String },
  level: { type: String },
  seeking: { type: String },
  updated_at: { type: Date, default: Date.now }
});

// resume URL is at https://founders-resumes.s3.amazonaws.com/{netid}.pdf
// created_at timestamp can be retrieved using _id: ObjectId(_id).getTimestamp()

var student = mongoose.model('Student', studentSchema);

module.exports = student;