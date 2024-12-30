const Department = require('../models/Department');
const slugify = require('slugify');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const departmentData = new Department({
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true }) // Generate slug from the name
    });
    const savedDepartment = await departmentData.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id)
    .populate('manager_id', 'first_name last_name email')
    .populate('company_id', 'company_name company_address phone'); // Populate company details (adjust fields as needed)
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get department by slug
exports.getDepartmentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const department = await Department.findOne({ slug })
    .populate('manager_id', 'first_name last_name email')
    .populate('company_id', 'company_name company_address phone'); // Populate company details (adjust fields as needed)
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    .populate('manager_id', 'first_name last_name email')
    .populate('company_id', 'company_name company_address phone'); // Populate company details (adjust fields as needed)
    res.status(200).json(departments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a department by ID
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, code, manager_id } = req.body;
    // Generate slug from the name
    const slug = slugify(name, { lower: true, strict: true });

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, status, code, manager_id, slug },
      { new: true, runValidators: true }, // Return updated document and validate
    );
    
    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
