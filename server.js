const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());

// 🔐 Load from .env (set these on Render)
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URI = 'https://christiandmelendez.github.io/-Spotify-integrated-3D-Blob-Visualizer'; // Your GitHub Pages front-end
const REDIRECT_URI = 'https://audiovisualizer-62xe.onrender.com/callback'; // Your Render backend callback

// 🎧 Spotify login route
app.get('/login', (req, res) => {
    const scope = 'user-read-playback-state user-read-currently-playing';
    const authQuery = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${authQuery}`);
});

// 🎯 Spotify callback route
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
                client_secret: CLIENT_SECRET,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token } = response.data;

        // Optional: Redirect back to frontend with access_token in hash
        res.redirect(`${FRONTEND_URI}/#access_token=${access_token}`);
    } catch (error) {
        console.error('Error exchanging code for token:', error.response?.data || error.message);
        res.status(500).send('Authentication failed');
    }
});

// ✅ Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
