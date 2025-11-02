const { Queue } = require('bullmq');

const jobImportQueue = new Queue('job-import', {
  connection: {
    host: new URL(process.env.REDIS_URL).hostname,
    port: parseInt(new URL(process.env.REDIS_URL).port || '6379'),
    password: process.env.REDIS_URL.includes('@')
      ? process.env.REDIS_URL.split('@')[0].split(':').pop()
      : undefined,
    tls: process.env.REDIS_URL.startsWith('rediss')
  }
});

jobImportQueue.on('added', (job) => {
  console.log(`Job added to queue: ${job.name} | ${job.data.url}`);
});

module.exports = jobImportQueue;