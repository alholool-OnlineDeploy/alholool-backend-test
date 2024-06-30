const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  userID: { type: String, required: true },
  zohoID: { type: String, required: true },
  item: { type: String, required: true },
  description: { type: String, required: true },
  transactionID: { type: String, required: true, unique: true },
  amount: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
