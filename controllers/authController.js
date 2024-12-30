const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import the JWT library
const User = require('../models/User'); // Adjust to your user model path
const nodemailer = require('nodemailer');
const config = require('../config/config');
const { body, validationResult } = require('express-validator'); // For validation

// Middleware for validation
const validateRegistration = [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password_hash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('first_name').isString().notEmpty().withMessage('First name is required'),
    // Email validation
    body('email').isEmail().withMessage('A valid email is required'),
    body('status')
    .isString()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either "Active" or "Inactive"'),
    body('role')
    .isString()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['Admin', 'Employee', 'Manager'])
    .withMessage('Role must be either "Admin", "Employee", or "Manager"')
];

// Middleware for password validation
const validatePasswordChange = [
    body('current_password').isString().notEmpty().withMessage('Current password is required'),
    body('new_password')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

// Function to register a new user
const registerUser = async (req, res) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password_hash, first_name, company_id, email, role, status, date_of_birth, image } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password_hash, 10);

        // Create a new user
        const newUser = new User({
            username,
            password_hash: hashedPassword,
            first_name,
            role,
            status,
            company_id, // store company_id
            email,
            date_of_birth, 
            image
        });
        req.body;

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
        const apiToken = jwt.sign({userID: newUser.user_id}, process.env.JWT_SECRET, {expiresIn: '1h'}); // Adjust expiration as needed
        newUser.api_token = apiToken;
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!', api_token: apiToken });
    } catch (error) {
        console.error('Error registering user:', error); // Log error for debugging
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Function to log in a user
const loginUser = async (req, res) => {
    try {
        const { username, password_hash } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check if the user's status is "Inactive"
        if (user.status === 'Inactive') {
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (!isMatch) {
            user.login_attempts = (user.login_attempts || 0) + 1;
            await user.save();
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // const ipAddress = res.ip;
        // const ipAddress = res.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Capture real IP behind proxies
        const ipAddress = req.headers['x-forwarded-for'] 
                  ? req.headers['x-forwarded-for'].split(',')[0].trim()  // If there's a list of proxies, use the first one
                  : req.connection.remoteAddress || req.socket.remoteAddress || req.ip;

        const userAgent = req.headers['user-agent']; // This captures the device details

        // Generate a new token on success login
        // const apiToken = jwt.sign({ useId: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});
        const apiToken = jwt.sign({ useId: user._id}, process.env.JWT_SECRET);

        // Update user with the new token (optional, can also be kept the same)
        user.api_token = apiToken;      
        user.last_device_login = userAgent; // save the device info
        user.ip_address = ipAddress; // Save the IP address
        user.last_login = new Date(); // Save the last login time
        user.login_attempts = 0; // Reset login attems on successfull login  
        await user.save();

        // Exclude sensitive fields like password_hash from the response
        const { password_hash: _, ...userWithoutPassword } = user.toObject();
        // Successful login
        res.status(200).json({ message: 'Login successful!', user: userWithoutPassword  });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

// Function to get user by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const user = await User.findById(userId).select('-password_hash'); // Exclude password_hash from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
};

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password_hash'); // Exclude password_hash from response
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Function to update user details
const updateUser = async (req, res) => {
    console.log('Update user function triggered'); // Add this line
    try {
        const { userId } = req.params;
        const { username, first_name, password_hash, email, phone, role, status, company_id, date_of_birth, image } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (username) user.username = username;
        if (first_name) user.first_name = first_name;
        if(email) user.email = email;
        if(phone) user.phone = phone;
        if(role) user.role = role;
        if(status) user.status = status;
        if(company_id) user.company_id = company_id;
        if(date_of_birth) user.date_of_birth = date_of_birth;
        if(image) user.image = image;
        if (password_hash) {
            user.password_hash = await bcrypt.hash(password_hash, 10);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Function to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        
        // Find and delete the user by their ID
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// This function will handle changing the user's password after verifying the current password.
const changePassword = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const { current_password, new_password } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current password matches
        const isMatch = await bcrypt.compare(current_password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password and update the user's password
        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        user.password_hash = hashedNewPassword;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};



// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,  // Use 587 if TLS is preferred
    secure: true,  // true for 465, false for 587    
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

// Send password reset email
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Generate reset token
        const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

        // Store the reset token in the database
        user.reset_password_token = resetToken;
        user.reset_password_expires = Date.now() + 3600000;  // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.BASE_URL}/confirm-password/${resetToken}`;

        // Email options
        const mailOptions = {
            from: config.email.user,
            to: user.email,
            subject: 'Password Reset Request',
            text: `
                Dear ${user.first_name || 'User'},

                You are receiving this email because you requested a password reset for your account.

                To reset your password, please click on the following link:
                ${resetUrl}

                If you did not request this password reset, please ignore this email. Your password will remain unchanged.

                Thank you,
                The Support Team
            `.trim(), // This ensures no leading/trailing whitespace in the message
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to email!' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ message: 'Error sending reset email', error: error.message });
    }
};

// Confirm and reset password
const confirmResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { new_password } = req.body;

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findOne({ _id: decoded.userId, reset_password_token: token });

        if (!user || user.reset_password_expires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password_hash = hashedPassword;
        user.reset_password_token = undefined;  // Clear token
        user.reset_password_expires = undefined;  // Clear token expiry
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};




module.exports = { registerUser, validateRegistration, loginUser, getUserById, getAllUsers, updateUser, deleteUser, changePassword, validatePasswordChange, resetPassword, confirmResetPassword };
