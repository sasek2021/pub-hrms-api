const express = require('express');
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define routes for employee operations
router.post('/', authMiddleware, createEmployee); // Create employee
router.get('/', authMiddleware, getAllEmployees); // Get all employees
router.get('/:id', authMiddleware, getEmployeeById); // Get employee by ID
router.put('/:id', authMiddleware, updateEmployee); // Update employee by ID
router.delete('/:id', authMiddleware, deleteEmployee); // Delete employee by ID

module.exports = router;
