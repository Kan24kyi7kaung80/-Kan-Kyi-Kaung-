const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    let m3uContent = "#EXTM3U\n\n";
    const baseUrl = 'https://m.857zb81.com';

    const response = await axios.get(`${baseUrl}/?t=${Date.now()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const matchRegex = /href=["']([^"']*live[^"']*)["']/g;
    let match;
    let count = 1;

    while ((match = matchRegex.exec(html)) !== null) {
      let link = match[1];
      if (!link.startsWith('http')) {
        link = `${baseUrl}${link.startsWith('/') ? '' : '/'}${link}`;
      }
      m3uContent += `#EXTINF:-1 group-title="857zb Matches", 857zb Live Match ${count}\n${link}\n\n`;
      count++;
    }

    if (count === 1) {
      m3uContent += `#EXTINF:-1 group-title="857zb Main", 857zb Direct Stream 1\n${baseUrl}/\n\n`;
      m3uContent += `#EXTINF:-1 group-title="857zb Main", 857zb Direct Stream 2\n${baseUrl}/#/live\n\n`;
    }

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.status(200).send(m3uContent);

  } catch (error) {
    res.status(500).send("Error fetching 857zb: " + error.message);
  }
}
