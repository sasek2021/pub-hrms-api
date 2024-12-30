const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employee_no: { type: String, required: true, unique: true }, // Employee Number
    status: { type: String, enum: ['Active', 'Inactive', 'Resign', 'Sick Leave', 'Vacation Leave', 'Parental Leave', 'Unpaid Leave', 'Probation'], default: 'Active' }, // Add status field
    last_name: { type: String }, // Last Name
    first_name: { type: String, required: true }, // First Name
    birthdate: { type: Date, required: true }, // Birthdate
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, // Gender
    hire_date: { type: Date, required: true }, // Hire Date
    religion: { type: String }, // Religion
    marital_status: { type: String }, // Marital Status
    dependents: { type: Number, min: 0 }, // Dependents
    birth_place: { type: String }, // Birth Place
    first_language: { type: String }, // First Language
    second_language: { type: String }, // Second Language
    degree: { type: String }, // Degree
    passport_number: { type: String }, // Passport Number
    passport_front: { type: String }, // Passport Image Front
    passport_back: { type: String }, // Passport Image Back
    id_number: { type: String }, // ID Number
    id_front: { type: String }, // ID Image front
    id_back: { type: String }, // ID Image back
    work_permit_number: { type: String }, // Work Permit Number
    medical_insurance_number: { type: String }, // Medical Insurance Number
    reference_number: { type: String }, // Reference Number
    foreigner: { type: Boolean, default: false }, // Is Foreigner
    smoker: { type: Boolean, default: false }, // Is Smoker
    disability: { type: Boolean, default: false }, // Is Disabled
    entity: { type: String }, // Entity
    employee_type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true }, // Employee Type
    job: { type: String }, // Job Title
    work_calendar: { type: String }, // Work Calendar
    seniority_date: { type: Date }, // Seniority Date
    effective_date: { type: Date }, // Effective Date
    job_expiry_date: { type: Date }, // Job Expiry Date
    career_start_date: { type: Date }, // Career Start Date
    working_age_date: { type: Date }, // Working Age Date
    last_revise_date: { type: Date }, // Last Revise Date
    termination_date: { type: Date }, // Termination Date
    last_hire_date: { type: Date }, // Last Hire Date
    labor_contract_sign: { type: Date }, // Labor Contract Sign Date
    email: { type: String, unique: true }, // Email
    phone: { type: String, match: /^\+?[1-9]\d{1,14}$/ }, // E.164 phone format
    salary: { type: Number, required: true }, // Salary
    date_of_joining: { type: Date, default: Date.now }, // Date of Joining
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }], // Attendance reference
    notes: { type: String },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }, // Department reference
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true }, // Designation reference
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Company reference
    image: { type: String } // image
});

module.exports = mongoose.model('Employee', employeeSchema);
