// controllers/designationController.js
const Designation = require('../models/Designation');

// Create a new designation
exports.createDesignation = async (req, res) => {
    try {
        const designation = new Designation(req.body);
        await designation.save();
        res.status(201).json(designation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all designations
exports.getAllDesignations = async (req, res) => {
    try {
        const designations = await Designation.find();
        res.json(designations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific designation by ID
exports.getDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findById(req.params.id);
        if (!designation) return res.status(404).json({ message: 'Designation not found' });
        res.json(designation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a designation by ID
exports.updateDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!designation) return res.status(404).json({ message: 'Designation not found' });
        res.json(designation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a designation by ID
exports.deleteDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findByIdAndDelete(req.params.id);
        if (!designation) return res.status(404).json({ message: 'Designation not found' });
        res.json({ message: 'Designation deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
