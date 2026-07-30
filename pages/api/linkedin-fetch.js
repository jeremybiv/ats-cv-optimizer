import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { url } = req.body;
    if (!url || !url.includes('linkedin.com/in/')) {
      return res.status(400).json({ error: 'URL LinkedIn invalide' });
    }

    // Extract username from URL
    const match = url.match(/linkedin\.com\/in\/([^/?]+)/);
    if (!match) {
      return res.status(400).json({ error: 'Impossible d\'extraire le profil' });
    }
    const username = match[1];

    let name = username;
    let title = '';
    let summary = '';
    let skills = [];
    let experience = [];

    // Try to scrape the public LinkedIn profile
    try {
      const { data: html } = await axios.get(`https://www.linkedin.com/in/${username}/`, {
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        },
      });

      const $ = cheerio.load(html);

      // Try to extract name
      const nameEl =
        $('h1').first().text().trim() ||
        $('[class*="name"]').first().text().trim() ||
        $('[class*="title"]').first().text().trim();
      if (nameEl && nameEl.length > 1 && nameEl.length < 100) {
        name = nameEl;
      }

      // Try to extract headline/title
      const titleEl =
        $('[class*="headline"]').first().text().trim() ||
        $('[class*="subtitle"]').first().text().trim();
      if (titleEl) title = titleEl;

      // Try to extract summary/about
      const summaryEl =
        $('[class*="summary"]').first().text().trim() ||
        $('[class*="about"]').first().text().trim() ||
        $('section.about p').first().text().trim();
      if (summaryEl) summary = summaryEl;

      // Try to extract skills
      $('[class*="skill"]').each((_, el) => {
        const skill = $(el).text().trim();
        if (skill && skill.length < 60 && !skill.includes(' ') && skill.length > 1) {
          skills.push(skill);
        }
      });

      // If no skills found via selector, try any visible inline items
      if (skills.length === 0) {
        $('li[class*="skill"], span[class*="skill"], div[class*="skill"]').each((_, el) => {
          const skill = $(el).text().trim();
          if (skill && skill.length < 60 && skill.length > 1) {
            skills.push(skill);
          }
        });
      }

      // Try to extract experience
      $('[class*="experience"] section, section[class*="experience"]').each((_, section) => {
        const expTitle = $(section).find('[class*="title"]').first().text().trim();
        const expCompany = $(section).find('[class*="company"]').first().text().trim();
        const expDates = $(section).find('[class*="date"]').first().text().trim();
        const expDesc = $(section).find('[class*="description"]').first().text().trim();

        if (expTitle || expCompany) {
          experience.push({
            title: expTitle || 'Experience',
            company: expCompany || '',
            dates: expDates || '',
            description: expDesc ? [expDesc] : [],
          });
        }
      });

      // Clean up skills — deduplicate and remove empty/numeric
      skills = [...new Set(skills.map((s) => s.replace(/[.,;]/g, '').trim()).filter(Boolean))];

      // If scraping actually returned something usable, return it
      if (name !== username || title || summary || skills.length > 0) {
        return res.json({
          name,
          title,
          summary,
          skills,
          experience,
          source: 'scraped',
          username,
        });
      }
    } catch (scrapeErr) {
      // Scraping failed — LinkedIn blocks. Fall through to fallback.
      console.log('LinkedIn scraping failed, using fallback:', scrapeErr.message);
    }

    // Fallback: return just the username, frontend will show a textarea
    return res.json({
      name: username,
      title: '',
      summary: '',
      skills: [],
      experience: [],
      source: 'fallback',
      username,
    });
  } catch (err) {
    console.error('LinkedIn fetch error:', err);
    return res.status(500).json({
      error: 'Erreur lors de la récupération du profil',
      details: err.message,
    });
  }
}
