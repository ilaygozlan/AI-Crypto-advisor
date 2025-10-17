import 'dotenv/config';
import crypto from 'crypto';
import readline from 'readline';
import fetch from 'node-fetch';

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_REDIRECT_URI,
  REDDIT_USER_AGENT,
} = process.env;

if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_REDIRECT_URI || !REDDIT_USER_AGENT) {
  console.error('❌ Missing env vars. Make sure REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REDIRECT_URI, REDDIT_USER_AGENT exist in .env');
  process.exit(1);
}

// 1) Create authorization link and ask you to open it in browser
const state = crypto.randomBytes(16).toString('hex');
const scope = encodeURIComponent('read');               // Can add more scopes if needed
const duration = 'permanent';                           // To get refresh_token
const authorizeUrl =
  `https://www.reddit.com/api/v1/authorize` +
  `?client_id=${encodeURIComponent(REDDIT_CLIENT_ID)}` +
  `&response_type=code` +
  `&state=${state}` +
  `&redirect_uri=${encodeURIComponent(REDDIT_REDIRECT_URI)}` +
  `&duration=${duration}` +
  `&scope=${scope}`;

console.log('🔗 1) Open this URL in your browser and approve the app:');
console.log(authorizeUrl);
console.log('\n👉 After approval, you will be redirected to:',
  REDDIT_REDIRECT_URI,
  '\nCopy the full URL from your browser address bar.\n');

// 2) Get the URL you returned to and extract the code from it
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Paste the FULL redirect URL here:\n> ', async (redirectedUrl) => {
  try {
    const u = new URL(redirectedUrl.trim());
    const code = u.searchParams.get('code');
    const returnedState = u.searchParams.get('state');
    if (!code) throw new Error('Missing ?code= in the pasted URL');
    if (returnedState !== state) throw new Error('State mismatch (CSRF protection)');

    // 3) Exchange the code for access_token + refresh_token
    const basic = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': REDDIT_USER_AGENT,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDDIT_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      throw new Error(`Token exchange failed (${tokenRes.status}): ${txt}`);
    }

    const tokens = await tokenRes.json();
    console.log('\n✅ Success!');
    console.log('access_token:', tokens.access_token ? '[received]' : 'missing');
    console.log('token_type  :', tokens.token_type);
    console.log('expires_in  :', tokens.expires_in, 'seconds');
    console.log('\n📌 REFRESH TOKEN (save into .env as REDDIT_REFRESH_TOKEN):\n', tokens.refresh_token);

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    rl.close();
    process.exit(1);
  }
});