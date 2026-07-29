/**
 * Job description fetcher - retrieves job posting text from URLs
 */
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch job description text from a URL
 * @param {string} url - The job posting URL
 * @returns {Promise<string>} Extracted text from the page
 */
async function fetchJobFromURL(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // Remove script, style, nav, footer elements
    $('script, style, nav, footer, header, aside, .sidebar, .menu, .nav').remove();

    // Try to extract job-specific content from common selectors
    let jobText = '';

    // Common job description selectors
    const selectors = [
      '.job-description',
      '.description',
      '[data-testid="job-description"]',
      '.job-details',
      '.posting',
      '#job-description',
      '.job-body',
      '.content',
      'main',
      'article',
      '.post-content',
      '.job-view',
    ];

    for (const sel of selectors) {
      const el = $(sel);
      if (el.length) {
        jobText = el.text().trim();
        if (jobText.length > 100) break;
      }
    }

    // Fallback: get all body text
    if (!jobText || jobText.length < 100) {
      jobText = $('body').text().trim();
    }

    // Clean up whitespace
    jobText = jobText
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return jobText || 'Unable to extract job description from this URL.';
  } catch (error) {
    throw new Error(`Failed to fetch job URL: ${error.message}`);
  }
}

module.exports = { fetchJobFromURL, extractJobDescription: fetchJobFromURL };
