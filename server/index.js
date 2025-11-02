require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const importHistoryRouter = require('./src/routes/importHistory');
require('./workers/jobImportWorker');
const { scheduleHourlyImport } = require('./jobs/scheduleJobImport');

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('...Connected to MongoDB'))
  .catch(err => console.error(' MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/import-history', importHistoryRouter);
scheduleHourlyImport();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});