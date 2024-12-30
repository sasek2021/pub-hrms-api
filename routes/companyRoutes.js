const express = require('express');
const { getCompanyById, getAllCompanies, createCompany, updateCompany, deleteCompany, createBranchCompany, updateBranchCompany } = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get a company by ID
router.get('/companies/:id', authMiddleware, getCompanyById);

// Get all companies
router.get('/companies', authMiddleware, getAllCompanies);

// Create a new company
router.post('/companies', authMiddleware, createCompany);

// Update an existing company
router.put('/companies/:id', authMiddleware, updateCompany);

// Create a new branch under company
router.post('/branches', authMiddleware, createBranchCompany);

// Update an existing branch
router.put('/branches/:id', authMiddleware, updateBranchCompany);

// Delete a company
router.delete('/companies/:id', authMiddleware, deleteCompany);

module.exports = router;
