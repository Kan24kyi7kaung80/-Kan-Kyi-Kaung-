const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    let m3uContent = "#EXTM3U\n\n";

    const sites = [
      { name: '857zb', url: 'https://m.857zb81.com' },
      { name: 'SutbongTV', url: 'https://m.sutbongtv.com' },
      { name: '90phutZag', url: 'https://90phutzag.tv' },
      { name: 'FMP Live', url: 'https://m.fmp.live' }
    ];

    // Regex to find links containing 'live' or 'match'
    const linkRegex = /href=["']([^"']*(?:live|match)[^"']*)["']/gi;

    for (const site of sites) {
      try {
        const response = await axios.get(site.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': site.url
          },
          timeout: 8000
        });

        const html = response.data;
        let match;
        let count = 1;
        let foundLinks = new Set();

        while ((match = linkRegex.exec(html)) !== null) {
          let relativeOrAbsoluteUrl = match[1];
          
          let fullUrl = relativeOrAbsoluteUrl;
          if (!fullUrl.startsWith('http')) {
            const base = site.url.endsWith('/') ? site.url.slice(0, -1) : site.url;
            if (fullUrl.startsWith('/')) {
              fullUrl = `${base}${fullUrl}`;
            } else {
              fullUrl = `${base}/${fullUrl}`;
            }
          }

          if (!foundLinks.has(fullUrl)) {
            foundLinks.add(fullUrl);
            m3uContent += `#EXTINF:-1 group-title="${site.name} Matches", ${site.name} Live Match ${count}\n${fullUrl}\n\n`;
            count++;
          }
        }

        // Fallback if no specific match links are found on the homepage
        if (count === 1) {
          m3uContent += `#EXTINF:-1 group-title="${site.name} Main", ${site.name} Home Page\n${site.url}/\n\n`;
        }

      } catch (err) {
        console.error(`Error with ${site.name}: ` + err.message);
        m3uContent += `#EXTINF:-1 group-title="${site.name} Error", ${site.name} Main (Fallback)\n${site.url}/\n\n`;
      }
    }

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.status(200).send(m3uContent);

  } catch (error) {
    res.status(500).send("Error generating playlist: " + error.message);
  }
}
