import 'dotenv/config';
import Snoowrap from 'snoowrap';

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

reddit.config({
  endpointDomain: 'oauth.reddit.com',
  requestDelay: 1100,
});

(async () => {
  const posts = await reddit.getSubreddit('CryptoMemes').getHot({ limit: 5 });
  console.log('🔥 Connected! Titles:\n');
  posts.forEach(p => console.log('-', p.title));
})();
