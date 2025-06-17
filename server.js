const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

app.get('/login', (req, res) => {
    const scope = "user-read-playback-state user-read-currently-playing";
    res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI
    })}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const response = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    res.json(response.data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
