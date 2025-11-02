const Parser = require('rss-parser');

const parser = new Parser({
  customFields: {
    item: ['job_category', 'job_type', 'job_region']
  }
});

async function fetchAndParseRSS(url) {
  try {
    console.log(`📡 Fetching RSS from: ${url}`);
    const feed = await parser.parseURL(url);
    
    return feed.items.map(item => ({
      title: item.title || 'No title',
      link: item.link,
      description: item.contentSnippet || item.description || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      category: item.job_category || 'general',
      jobType: item.job_type || 'unknown',
      region: item.job_region || 'global',
      source: new URL(url).hostname
    }));
  } catch (error) {
    console.error(`Failed to parse RSS from ${url}:`, error.message);
    throw error;
  }
}

module.exports = { fetchAndParseRSS };