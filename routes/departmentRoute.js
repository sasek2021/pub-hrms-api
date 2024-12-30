const express = require('express');
const { createDepartment, getDepartmentById, getAllDepartments, updateDepartment, deleteDepartment, getDepartmentBySlug } = require('../controllers/dapartmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// CRUD routes
router.post('/', authMiddleware, createDepartment);         // Create a new department
router.get('/:id', authMiddleware, getDepartmentById);      // Get a single department by ID
router.get('/', authMiddleware, getAllDepartments);         // Get all departments
router.get('/slug/:slug', authMiddleware, getDepartmentBySlug); // Get a single department by Slug
router.put('/:id', authMiddleware, updateDepartment);       // Update a department by ID
router.delete('/:id', authMiddleware, deleteDepartment);    // Delete a department by ID

module.exports = router;