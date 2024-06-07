const axios = require('axios');

// Replace these with your access token and organization ID
const accessToken = '1000.acc8fb33f3c03b32958a2341ec0500a4.532f22ffd916187bb048d1c4c3ba27c3';
const organizationId = '766836792';

// Replace these with your template IDs
const templates = {
  business: '2969006000005518001', // Replace with your actual Business template ID
  individual: '2969006000006341101' // Replace with your actual Individuals template ID
};

// Function to get customer details
async function getCustomer(customerId) {
  try {
    const response = await axios.get(`https://www.zohoapis.com/books/v3/customers/${customerId}?organization_id=${organizationId}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.customer;
  } catch (error) {
    console.error('Error fetching customer details:', error.response.data);
    throw new Error('Failed to fetch customer details.');
  }
}

// Function to determine the correct template based on customer layout
function getTemplateId(contactName) {
  if (contactName.includes('Ltd') || contactName.includes('Inc') || contactName.includes('Corp')) {
    return templates.business; // Business layout
  } else {
    return templates.individual; // Individual layout
  }
}

// Function to create an invoice with the correct template
async function createInvoice(customerId, itemId) {
  try {
    const customer = await getCustomer(customerId);
    const templateId = getTemplateId(customer.contact_name);

    const invoiceData = {
      customer_id: customerId,
      template_id: templateId,
      line_items: [
        {
          item_id: itemId,
          quantity: 1,
          rate: 100.0
        }
      ]
    };

    const response = await axios.post(`https://www.zohoapis.com/books/v3/invoices?organization_id=${organizationId}`, invoiceData, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Invoice created:', response.data);
  } catch (error) {
    console.error('Error creating invoice:', error.response.data);
  }
}

// Example usage
const customerId = 'YOUR_CUSTOMER_ID'; // Replace with your actual customer ID
const itemId = 'YOUR_ITEM_ID'; // Replace with your actual item ID
createInvoice(customerId, itemId);
