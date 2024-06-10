const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { type } = require("os");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "first name required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "last name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: { type: String, default: "Undefined" },
    city: { type: String, default: "Undefined" },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    type: {
      type: String,
      enum: [
        "المستخدم العادي",
        "المستخدم المهني او الطالب",
        "رائد أعمال او عمل حر",
        "لاعب محترف",
      ],
      default: "المستخدم العادي",
    },
    role: {
      type: String,
      enum: ["individual", "business", "admin"],
      default: "individual",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
