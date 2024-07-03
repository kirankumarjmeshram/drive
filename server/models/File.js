// You can add more schema definitions if needed
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  uploadDate: Date
});

module.exports = mongoose.model('File', FileSchema);
