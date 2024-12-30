const mongoose = require('mongoose');
const CompanyModel = require('../models/Company');

// Create a new main company
exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;

        // Create a new main company
        const company = new CompanyModel({
            ...companyData,
            parent_company: null // Set parent_company to null for main companies
        });
        
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a new branch company
exports.createBranchCompany = async (req, res) => {
    try {
        const branchData = req.body;

        // Validate if it's a branch company
        if (!branchData.parent_company) {
            return res.status(400).json({ message: 'Branch company must have a parent company ID.' });
        }

        // Create the branch company
        const branchCompany = new CompanyModel(branchData);
        await branchCompany.save();
        res.status(201).json(branchCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing company
exports.updateCompany = async (req, res) => {
    try {
        const updateData = req.body;

        // Check if parent_company needs to be updated
        if (updateData.parent_company) {
            try {
                updateData.parent_company = mongoose.Types.ObjectId(updateData.parent_company);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid parent company ID' });
            }
        }

        const company = await CompanyModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing branch company
exports.updateBranchCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if the branch company exists
        const branchCompany = await CompanyModel.findById(id);
        if (!branchCompany) {
            return res.status(404).json({ message: 'Branch company not found.' });
        }

        // Ensure the branch has a parent company ID
        if (!updateData.parent_company) {
            return res.status(400).json({ message: 'Branch company must have a parent company ID.' });
        }

        // Update branch company data
        Object.assign(branchCompany, updateData);
        await branchCompany.save();

        res.status(200).json(branchCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await CompanyModel.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await CompanyModel.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all companies with optional filtering for main or branch companies
exports.getAllCompanies = async (req, res) => {
    try {
        const { type } = req.query;
        let filter = {};

        if (type === 'main') {
            filter.parent_company = null; // Main companies have no parent
        } else if (type === 'branch') {
            filter.parent_company = { $ne: null }; // Branch companies have a parent
        }

        const companies = await CompanyModel.find(filter);
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
