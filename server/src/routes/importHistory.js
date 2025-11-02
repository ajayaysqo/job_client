const express = require('express');
const ImportLog = require('../models/ImportLog');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;