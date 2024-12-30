const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    icon: { type: String }, // URL for the icon image
    logo: { type: String }, // URL for the logo image
    company_name: { type: String, required: true, unique: true }, // Unique company name
    company_address: { type: String }, // Address of the company
    work_location: { type: String }, // Work location of the company
    phone: { type: String, match: /^\+?[1-9]\d{1,14}$/ }, // E.164 phone format
    website: { type: String, match: /^(https?:\/\/)?([a-z]+\.)?[a-z0-9]+(\.[a-z]{2,})+/ }, // Basic URL validation
    email: { type: String, match: /.+\@.+\..+/ }, // Company email
    social_media: { // Object to hold social media links
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        // Add more social media fields as needed
    },
    status: { type: String, enum: ['Active', 'Inactive'], required: true }, // Enum for status
    year_founded: { type: Number, min: 1900, max: new Date().getFullYear() }, // Year founded
    industry: { type: String }, // Industry the company operates in
    founder: { type: String }, // Founder(s) of the company    
    // New field to distinguish main companies and branches
    parent_company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null } // Null for main company, ObjectId for branches    
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Static method to check if a company is a main company
companySchema.statics.isMainCompany = function (companyId) {
    return this.findById(companyId).then(company => company.parent_company === null);
};

module.exports = mongoose.model('Company', companySchema);
