const axios = require('axios');
const { Mutex } = require('async-mutex');
require('dotenv').config();

const mutex = new Mutex();
let accessToken = ''; // Initially empty
let tokenExpires = 0;

async function refreshAccessToken() {
    const release = await mutex.acquire();
    try {
        if (Date.now() >= tokenExpires) {
            const params = new URLSearchParams();
            params.append('refresh_token', process.env.ZOHO_REFRESH_TOKEN);
            params.append('client_id', process.env.ZOHO_CLIENT_ID);
            params.append('client_secret', process.env.ZOHO_CLIENT_SECRET);
            params.append('grant_type', 'refresh_token');
            params.append('scope', 'ZohoCRM.modules.all,ZohoMail.accounts.ALL,ZohoMail.messages.ALL'); // Adding CRM and Mail scopes

            const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', params.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.data.access_token) {
                accessToken = response.data.access_token;
                tokenExpires = Date.now() + response.data.expires_in * 1000;
            } else {
                console.log('No access token returned:', response.data);
            }
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error.response ? error.response.data : error.message);
    } finally {
        release();
    }
    return accessToken;
}

exports.getAccessToken = async () => {
    if (Date.now() >= tokenExpires) {
        await refreshAccessToken();
    }
    return accessToken;
};

exports.initializeApp = async (app, port) => {
    await refreshAccessToken();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};
