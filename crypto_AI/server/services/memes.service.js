import 'dotenv/config';
import cron from 'node-cron';
import { pgPool } from '../memeDB/memeDB.js';
import { redditGetJson } from './redditClient.js';

const SUBS = ['CryptoMemes','cryptomemes','BitcoinMemes','CryptoCurrency','Bitcoin'];
const LIMIT_PER_SUB = 40;

const looksLikeImageUrl = (url='') => /\.(png|jpe?g|gif|webp)$/i.test((url.split('?')[0]||''));

function extractBestImageUrl(p) {
  // 1️⃣ Direct image
  if (p.url && /\.(png|jpe?g|gif|webp)$/i.test(p.url)) {
    return p.url.replace(/&amp;/g, '&');
  }

  // 2️⃣ preview image
  const preview = p.preview?.images?.[0]?.source?.url;
  if (preview) {
    return preview.replace(/&amp;/g, '&');
  }

  // 3️⃣ Gallery
  if (p.is_gallery && p.media_metadata) {
    const firstKey = Object.keys(p.media_metadata)[0];
    const item = p.media_metadata[firstKey];
    const s = item?.s?.u || item?.s?.gif || item?.s?.mp4;
    if (s) return String(s).replace(/&amp;/g, '&');
  }

  // 4️⃣ i.redd.it (direct images without extension)
  if (p.url && /i\.redd\.it/.test(p.url)) {
    return p.url.replace(/&amp;/g, '&');
  }

  // 5️⃣ preview.redd.it (lower quality image)
  if (p.url && /preview\.redd\.it/.test(p.url)) {
    return `${p.url.replace(/&amp;/g, '&')}`;
  }

  return null;
}


async function upsertMeme(row) {
  const sql = `
    INSERT INTO memes (id, subreddit, title, score, num_comments, permalink, source_url, cdn_url, is_nsfw, flair, author_name, created_utc)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO UPDATE SET
      score = EXCLUDED.score,
      num_comments = EXCLUDED.num_comments
  `;
  const vals = [
    row.id, row.subreddit, row.title, row.score, row.num_comments, row.permalink,
    row.source_url, row.cdn_url ?? null, row.is_nsfw, row.flair ?? null, row.author_name ?? null, row.created_utc,
  ];
  await pgPool.query(sql, vals);
}

export async function fetchMemes({ limitPerSub = LIMIT_PER_SUB } = {}) {
  let added = 0;
  const stats = [];

  for (const sub of SUBS) {
    const s = { sub, seen: 0, kept: 0, errors: 0 };
    try {
      // Reddit listing API: https://oauth.reddit.com/r/<sub>/hot
      const json = await redditGetJson(`/r/${sub}/hot`, { params: { limit: limitPerSub } });
      const posts = json?.data?.children?.map(c => c.data) || [];

      for (const p of posts) {
        s.seen++;
        try {
          if (p.over_18) continue;
          const imageUrl = extractBestImageUrl(p);
          if (!imageUrl) continue;

          await upsertMeme({
            id: p.id,
            subreddit: p.subreddit,
            title: p.title || '',
            score: Number(p.score || 0),
            num_comments: Number(p.num_comments || 0),
            permalink: `https://reddit.com${p.permalink}`,
            source_url: imageUrl,
            cdn_url: null,
            is_nsfw: !!p.over_18,
            flair: p.link_flair_text || null,
            author_name: p.author || null,
            created_utc: new Date((p.created_utc || p.created) * 1000),
          });
          s.kept++;
          added++;
        } catch (e) {
          s.errors++;
          console.warn(`[memes] skip ${p?.id}: ${e.message}`);
        }
      }

      console.log(`[memes] ${sub}: seen=${s.seen}, kept=${s.kept}, errors=${s.errors}`);
    } catch (e) {
      s.errors++;
      console.error(`[memes] subreddit ${sub} error: ${e.message}`);
    }
    stats.push(s);
  }

  console.log(`[memes] total added: ${added}`);
  return { added, stats };
}

export function startMemesCron() {
  // Run this function once a day at 00:00 to import new memes :)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('[cron] fetching memes…');
      const { added } = await fetchMemes();
      console.log(`[cron] added ${added} memes`);
    } catch (e) {
      console.error('[cron] error', e);
    }
  });
}