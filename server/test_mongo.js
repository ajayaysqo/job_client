const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://ajayvemala02_db_user:aYSFZtiuYEmKMKXS@cluster0.ulfyey2.mongodb.net/job_importer?retryWrites=true&w=majority';
// require('dotenv').config();
// const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });