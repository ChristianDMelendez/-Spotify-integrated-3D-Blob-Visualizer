const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');

const app = express();
app.use(cors());

// 🔐 Hardcoded for now to prove it works. Replace with process.env after it works.
const CLIENT_ID = 'e452bc1bd3814dda9f5eaf90f9d71b40';
const CLIENT_SECRET = '62c1daa7f81b4c7d800b30cbb0e9e6f9';
const REDIRECT_URI = 'https://audiovisualizer-62xe.onrender.com/callback';
const FRONTEND_URI = 'https://christiandmelendez.github.io/-Spotify-integrated-3D-Blob-Visualizer';

app.get('/login', (req, res) => {
  const scope = 'user-read-playback-state user-read-currently-playing';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = response.data;

    res.redirect(`${FRONTEND_URI}/#access_token=${access_token}`);
  } catch (err) {
    console.error('🟥 TOKEN EXCHANGE FAILED:', err?.response?.data || err.message);
    res.status(500).send('Token exchange failed.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
