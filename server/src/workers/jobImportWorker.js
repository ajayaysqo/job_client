const { Worker } = require('bullmq');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');
const { fetchAndParseRSS } = require('../services/rssParser');

const worker = new Worker('job-import', async (job) => {
  console.log(`STARTING JOB: ${job.id} | URL: ${job.data.url}`);

  try {
    const { url } = job.data;
    const failedJobs = [];
    let newCount = 0, updatedCount = 0;

    console.log(`Fetching and parsing RSS from: ${url}`);
    const jobs = await fetchAndParseRSS(url);

    console.log(`Found ${jobs.length} jobs`);

    for (const jobData of jobs) {
      try {
        const existing = await Job.findOne({ link: jobData.link });
        if (existing) {
          await Job.updateOne({ _id: existing._id }, jobData);
          updatedCount++;
          console.log(`Updated: ${jobData.link}`);
        } else {
          await Job.create(jobData);
          newCount++;
          console.log(`Created: ${jobData.link}`);
        }
      } catch (error) {
        console.error(`Failed to process job:`, error.message);
        failedJobs.push({ reason: error.message, jobData });
      }
    }

    const log = new ImportLog({
      fileName: url,
      totalFetched: jobs.length,
      totalImported: newCount + updatedCount,
      newJobs: newCount,
      updatedJobs: updatedCount,
      failedJobs
    });

    await log.save();
    console.log(`Import log saved for ${url}. New: ${newCount}, Updated: ${updatedCount}, Failed: ${failedJobs.length}`);

    return { newCount, updatedCount, failedCount: failedJobs.length };
  } catch (error) {
    console.error(`Worker failed for ${job.data.url}:`, error.message);
    throw error;
  }
}, {
  connection: {
    host: new URL(process.env.REDIS_URL).hostname,
    port: parseInt(new URL(process.env.REDIS_URL).port || '6379'),
    password: process.env.REDIS_URL.includes('@')
      ? process.env.REDIS_URL.split('@')[0].split(':').pop()
      : undefined,
    tls: process.env.REDIS_URL.startsWith('rediss')
  },
  concurrency: 3
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

console.log('BullMQ worker initialized and listening');

module.exports = worker;