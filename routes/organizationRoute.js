const express = require('express');
const { createOrganization, getAllOrganizations, getOrganizationById, updateOrganization, deleteOrganization } = require('../controllers/OrganizationController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define routes for organization operations
router.post('/', authMiddleware, createOrganization); // Create organization
router.get('/', authMiddleware, getAllOrganizations); // Get all organizations
router.get('/:id', authMiddleware, getOrganizationById); // Get organization by ID
router.put('/:id', authMiddleware, updateOrganization); // Update organization by ID
router.delete('/:id', authMiddleware, deleteOrganization); // Delete organization by ID

module.exports = router;
