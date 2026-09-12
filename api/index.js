const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    let m3uContent = "#EXTM3U\n\n";

    // 1. 857zb Links
    const url857 = 'https://m.857zb81.com';
    m3uContent += `#EXTINF:-1 group-title="857zb", 857zb Stream 1\n${url857}/\n\n`;
    m3uContent += `#EXTINF:-1 group-title="857zb", 857zb Stream 2\n${url857}/#/live\n\n`;

    // 2. Sutbongtv Links
    const urlSutbong = 'https://m.sutbongtv.com';
    m3uContent += `#EXTINF:-1 group-title="SutbongTV", SutbongTV Stream 1\n${urlSutbong}/\n\n`;
    m3uContent += `#EXTINF:-1 group-title="SutbongTV", SutbongTV Stream 2\n${urlSutbong}/#/live\n\n`;

    // 3. 90phutzag Links
    const url90phut = 'https://90phutzag.tv';
    m3uContent += `#EXTINF:-1 group-title="90phutZag", 90phutZag Stream 1\n${url90phut}/\n\n`;
    m3uContent += `#EXTINF:-1 group-title="90phutZag", 90phutZag Stream 2\n${url90phut}/#/live\n\n`;

    // 4. FMP Live Links
    const urlFmp = 'https://m.fmp.live';
    m3uContent += `#EXTINF:-1 group-title="FMP Live", FMP Live Stream 1\n${urlFmp}/#/anchor\n\n`;
    m3uContent += `#EXTINF:-1 group-title="FMP Live", FMP Live Stream 2\n${urlFmp}/\n\n`;

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.status(200).send(m3uContent);

  } catch (error) {
    res.status(500).send("Error generating playlist: " + error.message);
  }
}
