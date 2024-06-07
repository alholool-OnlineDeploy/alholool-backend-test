const axios = require('axios');
const tokenService = require('../services/tokenService'); // Ensure the path to your token service is correct

const zohoBooksConfig = {
    apiUrl: 'https://books.zoho.com/api/v3/invoices',
    organizationId: '766836792' // Storing the organization ID as you mentioned
};

async function createInvoice(customerId, lineItems, notes) {
    const authToken = await tokenService.getAccessToken(); // Get the current access token from your token service
    
    console.log('Preparing to send request to create invoice');
    
    try {
        const invoiceData = {
            customer_id: customerId,
            line_items: lineItems,
            notes: notes
        };

        const response = await axios.post(`${zohoBooksConfig.apiUrl}?organization_id=${zohoBooksConfig.organizationId}`, invoiceData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            console.log('Invoice created successfully:', response.data);
            return response.data;
        } else {
            console.error('Invoice creation failed with status:', response.status, 'and response:', response.data);
            throw new Error('Failed to create invoice due to non-success response status.');
        }
    } catch (error) {
        console.error('Failed to create invoice:', error);
        if (error.response) {
            console.error('HTTP Status:', error.response.status);
            console.error('HTTP Headers:', error.response.headers);
            console.error('HTTP Response Body:', error.response.data);
        } else {
            console.error('Error details:', error.message);
        }
        throw error; // Rethrow the error for further handling if necessary
    }
}

module.exports = {
    createInvoice
};
