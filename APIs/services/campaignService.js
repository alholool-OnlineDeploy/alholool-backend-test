const axios = require('axios');
const tokenService = require('../services/tokenService'); // Adjust the path as per your project structure

// Set your specific list key and Zoho Campaigns API details
const zohoCampaignsConfig = {
    apiUrl: 'https://campaigns.zoho.com/api/v1.1/addlistsubscribersinbulk',
    listKey: '3z44748d2134daf1d5cd7c3cf93aeb2fa3e88ed5102dc2a30bd214496dd7a62c53', // Update this with your actual list key
};

// Function to add a list of email IDs to a campaign list
async function addSubscribersInBulk(emailIds) {
    const accessToken = await tokenService.getAccessToken(); // Get the access token securely
    
    // Log request details for debugging
    console.log('Adding subscribers to the Zoho Campaigns list...');
    console.log(`List Key: ${zohoCampaignsConfig.listKey}`);
    console.log(`Emails to add: ${emailIds.join(', ')}`);
    console.log(`Using Access Token: ${accessToken.substring(0, 15)}...`);

    try {
        // Prepare the data to be sent to Zoho Campaigns API
        const requestData = {
            listkey: zohoCampaignsConfig.listKey,
            emailids: emailIds.join(','),
        };

        // Make a POST request to Zoho Campaigns API
        const response = await axios.post(zohoCampaignsConfig.apiUrl, requestData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded' // This content type is needed for form data
            },
        });

        // Check if the response indicates success
        if (response.status === 200 || response.status === 201) {
            console.log('Subscribers added successfully:', response.data);
            return { success: true, data: response.data };
        } else {
            console.error('Adding subscribers failed with status:', response.status, 'and response:', response.data);
            throw new Error('Failed to add subscribers due to non-success response status.');
        }
    } catch (error) {
        console.error('Error adding subscribers to Zoho Campaigns:', error);
        if (error.response) {
            console.error('HTTP Status:', error.response.status);
            console.error('HTTP Headers:', error.response.headers);
            console.error('HTTP Response Body:', error.response.data);
        } else {
            console.error('Error details:', error.message);
        }
        return { success: false, error: 'Failed to add subscribers to Zoho Campaigns' };
    }
}

module.exports = {
    addSubscribersInBulk
};
