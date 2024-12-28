const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors());

const rssFeeds = [
  'https://madeinparisiens.ouest-france.fr/flux/rss_news.php',
  'https://www.foot01.com/equipe/paris/news.rss',
  'https://dwh.lequipe.fr/api/edito/rss?path=/Football/Paris-sg/',
  'https://paris-supporters.fr/feed',
  'https://www.culturepsg.com/news?rss',
  'https://www.paristeam.fr/feed',
  'https://psgcommunity.com/feed/',
  'https://canal-supporters.com/feed/',
  'https://allezparis.fr/feed',
];

// Endpoint pour récupérer les actualités
app.get('/news', async (req, res) => {
  let newsItems = [];

  for (const url of rssFeeds) {
    try {
      const feed = await parser.parseURL(url);
      const siteName = new URL(url).hostname;

      feed.items.forEach((item) => {
        newsItems.push({
          title: item.title,
          link: item.link,
          description: item.contentSnippet,
          image: item.enclosure?.url || null,
          source: siteName,
        });
      });
    } catch (err) {
      console.error(`Erreur lors de la récupération du flux ${url}:`, err);
    }
  }

  // Trier les articles par date (si disponible)
  newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.json(newsItems);
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
