const axios = require('axios');
require('dotenv').config();

const publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY;
const secretKey = process.env.MOYASAR_SECRET_KEY;

// Mock payment details endpoint
exports.getPaymentDetails = (req, res) => {
    const service = req.query.service;
    let amount;
    let description;

    // Set amount and description based on service
    switch (service) {
        case '1':
            amount = 1000; // Example amount for service 1
            description = 'Service 1 Description';
            break;
        case '2':
            amount = 2000; // Example amount for service 2
            description = 'Service 2 Description';
            break;
        // Add more services as needed
        default:
            amount = 500; // Default amount
            description = 'Default Service Description';
    }

    res.json({ amount, currency: 'SAR', description });
};

// Create payment session
exports.createPaymentSession = async (req, res) => {
    try {
        const { service } = req.body;
        const userId = req.user.userId; // Extracted from token
        const email = req.user.email;   // Extracted from token

        let amount, description;

        // Set amount and description based on service
        switch (service) {
            case '1':
                amount = 1000; // Example amount for service 1
                description = 'Service 1 Description';
                break;
            case '2':
                amount = 2000; // Example amount for service 2
                description = 'Service 2 Description';
                break;
            // Add more services as needed
            default:
                amount = 500; // Default amount
                description = 'Default Service Description';
        }

        // Create a payment session with Moyasar
        const response = await axios.post('https://api.moyasar.com/v1/payments', {
            amount,
            currency: 'SAR',
            description,
            source: {
                type: 'creditcard',
                number: '4111111111111111',
                name: 'John Doe',
                cvc: '123',
                month: '01',
                year: '25' // Update to a valid year
            },
            callback_url: 'http://localhost:5500/api/payments/callback'
        }, {
            headers: {
                'Authorization': `Basic ${Buffer.from(secretKey).toString('base64')}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment session:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
};

// Handle payment callback
exports.handlePaymentCallback = (req, res) => {
    const payment = req.body;

    // Validate the payment details
    if (payment.status === 'paid') {
        // Process the payment (e.g., update database, send confirmation email)
        console.log('Payment successful:', payment);
    } else {
        console.log('Payment failed:', payment);
    }
    res.sendStatus(200);
};

// Handle payment callback (GET request for user-friendly confirmation)
exports.handlePaymentCallbackGet = (req, res) => {
    const { id, status, amount, message } = req.query;

    // Log the received payment details
    console.log('Payment callback received (GET):', { id, status, amount, message });

    // Check the payment status and show a user-friendly message
    if (status === 'paid') {
        // Process the payment (e.g., update database)
        console.log('Payment successful:', { id, status, amount, message });
        // Send a JSON response
        res.json({ success: true, id, status, amount, message });
    } else {
        console.log('Payment failed:', { id, status, amount, message });
        // Send a JSON response
        res.json({ success: false, id, status, amount, message });
    }
};
