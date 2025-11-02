const mongoose = require('mongoose');

const importLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [
    {
      reason: String,
      jobData: mongoose.Schema.Types.Mixed
    }
  ]
}, {
  timestamps: false
});

module.exports = mongoose.model('ImportLog', importLogSchema);