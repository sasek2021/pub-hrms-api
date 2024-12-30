const Organization = require("../models/Organization");

// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const organization = new Organization(req.body);
        await organization.save();
        res.status(201).json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find().populate('employees').populate('parent');
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id).populate('employees').populate('parent');
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update organization by ID
exports.updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete organization by ID
exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
