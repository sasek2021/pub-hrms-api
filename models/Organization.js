const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the organization
    type: { type: String, enum: ['Company', 'Department', 'Team'], required: true }, // Type of structure
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Reference to parent organization
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }], // Employees under this structure
    created_at: { type: Date, default: Date.now }, // Creation timestamp
    updated_at: { type: Date, default: Date.now } // Update timestamp
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
