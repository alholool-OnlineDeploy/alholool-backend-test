const axios = require('axios');
const tokenService = require('../services/tokenService'); // Adjust the path as necessary

const zohoBooksConfig = {
    apiUrl: 'https://books.zoho.com/api/v3/items',
    organizationId: '766836792' // Your stored organization ID
};

// Function to get all items
async function getAllItems() {
    const authToken = await tokenService.getAccessToken();

    try {
        const response = await axios.get(`${zohoBooksConfig.apiUrl}?organization_id=${zohoBooksConfig.organizationId}`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${authToken}`
            }
        });

        console.log('Items retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve items:', error);
        throw error;
    }
}

// Function to create a new item
async function createItem(itemData) {
    const authToken = await tokenService.getAccessToken();

    try {
        const response = await axios.post(`${zohoBooksConfig.apiUrl}?organization_id=${zohoBooksConfig.organizationId}`, itemData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Item created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create item:', error);
        throw error;
    }
}

// Export the functions for use elsewhere in your application
module.exports = {
    getAllItems,
    createItem
};
