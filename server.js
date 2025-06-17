const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

// Login → Redirect to Spotify OAuth
app.get('/login', (req, res) => {
    const scope = 'user-read-playback-state user-read-currently-playing';
    const authQuery = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI
    });
    res.redirect(`https://accounts.spotify.com/authorize?${authQuery}`);
});

// Callback → Exchange code for access token
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const { access_token } = response.data;

        // Redirect back to frontend with token
        res.redirect(`${FRONTEND_URI}/#access_token=${access_token}`);
    } catch (err) {
        console.error('Callback error:', err.response?.data || err.message);
        res.status(500).send('Authentication failed');
    }
});

// Now playing route
app.get('/now-playing', async (req, res) => {
    const token = req.headers['authorization'];

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 204 || response.data === '') {
            return res.json({ isPlaying: false });
        }

        const song = response.data.item;
        res.json({
            isPlaying: true,
            title: song.name,
            artist: song.artists.map(a => a.name).join(", "),
            album: song.album.name,
            albumArt: song.album.images[0]?.url,
            duration: song.duration_ms,
            progress: response.data.progress_ms
        });
    } catch (err) {
        console.error('Now playing error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch now playing track' });
    }
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
