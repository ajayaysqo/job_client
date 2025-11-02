const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  description: String,
  pubDate: { type: Date, default: Date.now },
  category: { type: String, default: 'general' },
  jobType: { type: String, default: 'unknown' },
  region: { type: String, default: 'global' },
  source: { type: String, required: true },
}, {
  timestamps: true
});
jobSchema.index({ link: 1, source: 1 });

module.exports = mongoose.model('Job', jobSchema);