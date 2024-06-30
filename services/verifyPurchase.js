const asyncHandler = require("express-async-handler");
const axios = require("axios");
require("dotenv").config();

const Order = require("../models/orderModel");
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

async function userData(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN, userID) {
  let data = {
    contact_id: "",
    billing_address_id: "",
    shipping_address_id: "",
  };
  const response = await axios.get(
    `https://www.zohoapis.com/books/v3/contacts/${userID}`,
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
async function itemData(item, description, amount) {
  if (item == "تثبيت برامج الاوفيس" && amount / 100 == 110)
    return {
      item_order: 1,
      item_id: "2969006000005946001",
      rate: 110,
      name: "install office",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "تثبيت مكافح فيروسات" && amount / 100 == 89)
    return {
      item_order: 1,
      item_id: "2969006000005451075",
      rate: 89,
      name: "install antivirus",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "تثبيت برامج أخرى" && amount / 100 == 110)
    return {
      item_order: 1,
      item_id: "2969006000005691021",
      rate: 110,
      name: "install applications",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "تعريف الطابعة على الكمبيوتر" && amount / 100 == 49)
    return {
      item_order: 1,
      item_id: "2969006000005451031",
      rate: 49,
      name: "identify the printer",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "اصلاح مشاكل الكمبيوتر وتسريع أدائه" && amount / 100 == 149)
    return {
      item_order: 1,
      item_id: "2969006000005600009",
      rate: 149,
      name: "fix computer & performance",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "ضبط اعدادات المودم" && amount / 100 == 99)
    return {
      item_order: 1,
      item_id: "2969006000005451049",
      rate: 99,
      name: "set up modem",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "اعداد الكمبيوتر (فورمات)" && amount / 100 == 189)
    return {
      item_order: 1,
      item_id: "2969006000000753013",
      rate: 189,
      name: "computer setup (format)",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "Quantity",
    };
  else if (item == "ترقية قطع أو اصلاح هاردوير" && amount / 100 == 89)
    return {
      item_order: 1,
      item_id: "2969006000005437035",
      rate: 89,
      name: "maintenance-upgrade HW",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "pcs",
    };
  else if (item == "استعادة بيانات الدرايف" && amount / 100 == 110)
    return {
      item_order: 1,
      item_id: "2969006000005434028",
      rate: 110,
      name: "Hardisk data recovery",
      description: description,
      quantity: "1.00",
      discount: "0%",
      tax_id: "2969006000004181053",
      project_id: "",
      tags: [],
      account_id: "2969006000000000388",
      item_custom_fields: [],
      unit: "pcs",
    };
  else return false;
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
async function createUserInvoice(zohoID, item, description, amount) {
  const REFRESH_ZOHO_BOOKS_ACCESS_TOKEN = await refreshToken();
  console.log("REFRESH_ZOHO_BOOKS_ACCESS_TOKEN");
  console.log(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN);

  const data = await userData(REFRESH_ZOHO_BOOKS_ACCESS_TOKEN, zohoID);
  const item_data = await itemData(item, description, amount);

  if (item_data) {
    const response = await axios.post(
      "https://www.zohoapis.com/books/v3/invoices",
      {
        branch_id: "2969006000000775135",
        payment_terms: 0,
        payment_terms_label: "Cash on Delivery",
        payment_options: { payment_gateways: [] },
        customer_id: zohoID,
        contact_persons: [data.contact_id],
        notes: "",
        terms: "",
        is_inclusive_tax: false,
        line_items: [item_data],
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
  }
}
exports.verifyPurchase = asyncHandler(async (req, res) => {
  const transactionID = req.query.id,
    amount = req.query.amount,
    status = req.query.status;
  message = req.query.message;

  const response = await axios.get(
    `https://api.moyasar.com/v1/payments/${transactionID}`,

    {
      auth: {
        username: "sk_test_6ZGiNUi9g5WXyDa3qto2tmiUyd5rAAbsdas4g6Ev",
      },
    }
  );
  if (
    response.data.status === "paid" &&
    response.data.source.message === "APPROVED"
  ) {
    let userID = response.data.metadata.user_id,
      zohoID = response.data.metadata.zoho_id,
      item = response.data.metadata.item;
    description = response.data.metadata.description;
    try {
      // Check if the transaction ID already exists
      const existingOrder = await Order.findOne({ transactionID });

      if (existingOrder) {
        return res.status(400).json({ message: "Order already verified" });
      }

      // If not, create a new order
      const newOrder = new Order({
        userID: userID,
        zohoID: zohoID,
        item: item,
        description: description,
        transactionID: transactionID,
        amount: amount,
        status: status,
      });

      await newOrder.save();
      createUserInvoice(zohoID, item, description, amount);
      res
        .status(201)
        .redirect(
          "https://alholool-frontend-test.netlify.app/Individual/profile.html"
        );
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else res.status(401).send("Error");

  return next();
});
