require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const importHistoryRouter = require('./routes/importHistory');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/import-history', importHistoryRouter);

app.get('/api/trigger-import', (req, res) => {
  const { addFeedsToQueue } = require('./jobs/scheduleJobImport');
  addFeedsToQueue();
  res.json({ message: 'Import triggered. Check terminal logs.' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    require('./workers/jobImportWorker');
    const { scheduleHourlyImport } = require('./jobs/scheduleJobImport');
    scheduleHourlyImport();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });