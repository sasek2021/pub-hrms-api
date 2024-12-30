// models/Designation.js
const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },  // e.g., Manager, Developer
    description: { type: String },                           // e.g., Role responsibilities
    level: { type: Number, required: true },                 // e.g., 1 for entry-level, 2 for mid-level
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }, // Department reference
}, { timestamps: true });

module.exports = mongoose.model('Designation', designationSchema);
