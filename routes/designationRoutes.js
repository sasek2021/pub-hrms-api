const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createDesignation, getAllDesignations, getDesignationById, updateDesignationById, deleteDesignationById } = require('../controllers/designationController');
const router = express.Router();

// Define routes for desination operations
router.post('/', authMiddleware, createDesignation); // Create desination
router.get('/', authMiddleware, getAllDesignations); // Get all desination
router.get('/:id', authMiddleware, getDesignationById); // Get desination by ID
router.put('/:id', authMiddleware, updateDesignationById); // Update desination by ID
router.delete('/:id', authMiddleware, deleteDesignationById); // Delete desination by ID

module.exports = router;
