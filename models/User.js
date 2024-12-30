// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true }, // Changed from 'password' to 'password_hash' for clarity
  role: { type: String, enum: ['Admin', 'Employee', 'Manager'], required: true }, // Enum for role
  status: { type: String, enum: ['Active', 'Inactive'], required: true }, // Enum for status
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Company reference
  last_login: { type: Date }, // Date type for last login
  image: { type: String }, // URL for the profile picture
  api_token: { type: String, default: null }, // API token
  is_back_up: { type: Boolean, default: false }, // Backup indicator
  first_name: { type: String, required: true }, // User's first name
  last_name: { type: String }, // User's last name
  date_of_birth: { type: Date }, // User's date of birth
  device: { type: String }, // User's device type
  ip_address: { type: String, maxlength: 45 }, // User's IP address
  last_device_login: { type: String }, // Change from Date to String
  login_attempts: { type: Number, default: 0 }, // Failed login attempts
  account_locked: { type: Boolean, default: false }, // Account locked indicator
  reset_password_token: { type: String },
  reset_password_expires: { type: Date },
  // Add new phone and email fields
  phone: { type: String, match: /^\+?[1-9]\d{1,14}$/ }, // E.164 phone format
  email: { type: String, required: true, unique: true } // User's email address, should be unique  
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
