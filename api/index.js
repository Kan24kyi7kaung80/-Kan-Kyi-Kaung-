
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

    const m3u8Regex = /(https?:\/\/[^\s"'<>]+?\.m3u8[^\s"'<>]*)/g;

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

        while ((match = m3u8Regex.exec(html)) !== null) {
          const streamUrl = match[1];
          if (!foundLinks.has(streamUrl)) {
            foundLinks.add(streamUrl);
            m3uContent += `#EXTINF:-1 group-title="${site.name} Live", ${site.name} Match ${count}\n${streamUrl}\n\n`;
            count++;
          }
        }
      } catch (err) {
        console.error(`Error with ${site.name}: ` + err.message);
      }
    }

    if (m3uContent === "#EXTM3U\n\n") {
      m3uContent += `#EXTINF:-1 group-title="Info", No direct m3u8 streams found currently\nhttp://localhost/no_stream_found.m3u8\n\n`;
    }

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.status(200).send(m3uContent);

  } catch (error) {
    res.status(500).send("Error generating playlist.");
  }
}
