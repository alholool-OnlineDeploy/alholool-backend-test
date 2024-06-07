const axios = require('axios');
const tokenService = require('../services/tokenService'); // Adjust the path as necessary

const zohoBooksConfig = {
    apiUrl: 'https://books.zoho.com/api/v3/customers',
    organizationId: '766836792' // Your stored organization ID
};

// Function to get all customers
async function getAllCustomers() {
    const authToken = await tokenService.getAccessToken();

    try {
        const response = await axios.get(`${zohoBooksConfig.apiUrl}?organization_id=${zohoBooksConfig.organizationId}`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${authToken}`
            }
        });

        console.log('Customers retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to retrieve customers:', error);
        throw error;
    }
}

// Function to create a new customer
async function createCustomer(customerData) {
    const authToken = await tokenService.getAccessToken();

    try {
        const response = await axios.post(`${zohoBooksConfig.apiUrl}?organization_id=${zohoBooksConfig.organizationId}`, customerData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Customer created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to create customer:', error);
        throw error;
    }
}

// Export the functions for use elsewhere in your application
module.exports = {
    getAllCustomers,
    createCustomer
};
