// Handles the business logic of creating leads.
const axios = require('axios');
const API_URL = 'https://www.zohoapis.com/crm/v2/Leads'; 
const { getAccessToken } = require('../services/tokenService');

exports.createLead = async (leadData) => {
    const accessToken = await getAccessToken();

    try {
        const response = await axios.post(API_URL, { data: [leadData] }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating Zoho lead:', error);
        return { success: false, error: 'Failed to create lead' };
    }
};