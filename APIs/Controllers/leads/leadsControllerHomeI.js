const axios = require('axios');
const leadService = require('../../services/leadService');
const {LAYOUT_ID} = require('../../utils/constants');

exports.createleadsIndForm = async (req, res) => {
    console.log('Received data:', req.body);

    try {

        // Split the contactName by spaces
        const nameParts = req.body.name.trim().split(/\s+/);

        // Assign the first word to First_Name
        const firstName = nameParts[0];

        // Join the rest of the words for Last_Name
        const lastName = nameParts.slice(1).join(' ');

        const leadData = {
            First_Name: firstName,
            Last_Name: lastName,
            Email: req.body.email,
            Mobile: req.body.mobile,
            City: req.body.city,
            Description:req.body.message,
            Lead_Source: "Home Form",
            Service:req.body.serviceType2,
            Layout:LAYOUT_ID
        };

        console.log('Constructed lead data:', leadData);

        // Call a service function to create the lead
        const result = await leadService.createLead(leadData);

        // Send a response based on the result of creating the lead
        if (result.success) {
            console.log('Lead created successfully:', result.data);
            res.status(200).send('Lead created successfully');
        } else {
            console.error('Failed to create lead:', result.error);
            res.status(500).send('Failed to create lead');
        }
    } catch (error) {
        console.error('Error in createleadsBusForm:', error);
        res.status(500).send('Internal Server Error');
    }
};