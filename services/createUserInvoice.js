require("dotenv").config();
const axios = require("axios");
const asyncHandler = require("express-async-handler");

const {
  JWT_SECRET_KEY,
  ZOHO_BOOKS_ACCESS_TOKEN,
  ZOHO_ORGANIZATION_ID,
  ZOHO_BOOKS_REFRESH_TOKEN,
  ZOHO_BOOKS_CLIENT_ID,
  ZOHO_BOOKS_CLIENT_SECRET,
} = process.env;

async function refreshToken() {
  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        refresh_token: ZOHO_BOOKS_REFRESH_TOKEN,
        client_id: ZOHO_BOOKS_CLIENT_ID,
        client_secret: ZOHO_BOOKS_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    }
  );

  let accessToken;

  if (response.data.access_token) {
    accessToken = response.data.access_token;
    console.log("New access token:", accessToken);
  } else {
    console.error("Failed to refresh access token:", response.data);
  }

  return accessToken;
}

async function userData(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN, customerID) {
  let data = {
    contact_id: "",
    billing_address_id: "",
    shipping_address_id: "",
  };
  const response = await axios.get(
    `https://www.zohoapis.com/books/v3/contacts/${customerID}`,
    {
      params: {
        organization_id: ZOHO_ORGANIZATION_ID,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${REFRESH_ZOHO_BOOKS_ACCESS_TOKEN}`,
      },
    }
  );
  data.contact_id = response.data.contact.primary_contact_id;
  data.billing_address_id = response.data.contact.billing_address.address_id;
  data.shipping_address_id = response.data.contact.shipping_address.address_id;
  return data;
}
async function editInvoiceStatus(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN) {
  const response = await axios.post(
    `https://www.zohoapis.com/books/v3/invoices/${invoiceID}/status/sent`,
    "",
    {
      params: {
        organization_id: ZOHO_ORGANIZATION_ID,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${REFRESH_ZOHO_BOOKS_ACCESS_TOKEN}`,
      },
    }
  );
}

exports.createUserInvoice = asyncHandler(async (req, res) => {
  const REFRESH_ZOHO_BOOKS_ACCESS_TOKEN = await refreshToken();
  console.log("REFRESH_ZOHO_BOOKS_ACCESS_TOKEN");
  console.log(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN);
  const customerID = "2969006000006773002";

  const data = await userData(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN, customerID);

  const response = await axios.post(
    "https://www.zohoapis.com/books/v3/invoices",
    {
      branch_id: "2969006000000775135",
      payment_terms: 0,
      payment_terms_label: "Cash on Delivery",
      payment_options: { payment_gateways: [] },
      customer_id: customerID,
      contact_persons: [data.contact_id],
      notes: "",
      terms: "",
      is_inclusive_tax: false,
      line_items: [
        {
          item_order: 1,
          item_id: "2969006000006506427",
          rate: 0,
          name: "abc",
          description: "",
          quantity: "1.00",
          discount: "0%",
          tax_id: "2969006000004181053",
          project_id: "",
          tags: [],
          account_id: "2969006000000000388",
          item_custom_fields: [],
          unit: "",
        },
      ],
      allow_partial_payments: false,
      custom_fields: [],
      is_discount_before_tax: "",
      discount: 0,
      discount_type: "item_level",
      adjustment: "",
      adjustment_description: "Adjustment",
      salesperson_id: "2969006000006382393",
      zcrm_potential_id: "",
      pricebook_id: "",
      template_id: "2969006000005518001",
      project_id: "",
      documents: [],
      mail_attachments: [],
      billing_address_id: data.billing_address_id,
      shipping_address_id: data.shipping_address_id,
      place_of_supply: "",
      tax_treatment: "non_gcc",
      tax_reg_no: "",
    },
    {
      params: {
        organization_id: ZOHO_ORGANIZATION_ID,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${REFRESH_ZOHO_BOOKS_ACCESS_TOKEN}`,
        "content-type": "application/json",
      },
    }
  );
  invoiceID = response.data.invoice.invoice_id;
  // await editInvoiceStatus(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN, invoiceID);
  res.status(201).json("done");
});
