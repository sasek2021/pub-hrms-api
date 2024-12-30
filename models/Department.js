// models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Inactive'], required: true }, // Enum for status
  code: { type: String, unique: true },
  slug: { type: String, unique: true },
  color: { type: String },
  manager_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }, // ObjectId to reference the manager from the User model
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company',
    required: true
  }, // ObjectId to reference the manager from the User model
  description: { type: String },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Department', departmentSchema);
