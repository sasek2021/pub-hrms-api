const express = require('express');
const cors = require('cors'); // Import CORS
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes'); // Adjust path as needed
const companyRoutes = require('./routes/companyRoutes'); // Adjust path as needed
const departmentRoute = require('./routes/departmentRoute'); // Adjust path as needed
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const organizationRoute = require('./routes/organizationRoute');
const designationRoutes = require('./routes/designationRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all requests
app.use(cors());
app.use(cookieParser());

// // Enable CORS
// app.use(cors({
//     origin: "*", // Replace with your frontend URL or '*' for all origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
// }));

app.set('trust proxy', true); // Enable this if your app is behind a proxy

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api', companyRoutes);
app.use('/api/departments', departmentRoute);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/organizations', organizationRoute);
app.use('/api/designations', designationRoutes);

// Serve static files (e.g., images) from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use the image upload routes
app.use('/api/images', imageRoutes);



// Mock database (simulating Firebase)
let usersDb = {};

// Utility function to generate a unique username
const generateUniqueUsername = (firstName) => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}${randomSuffix}`;
};

// Route for registration
app.post('/register', async (req, res) => {
    const { userId, firstName, phNumber } = req.body;

    // Generate username and password
    const username = generateUniqueUsername(firstName);
    const password = crypto.randomBytes(5).toString('hex'); // Random 10-character password

    // Store user data in the "database" (here, we use an in-memory object)
    const registrationTime = new Date().toISOString();
    usersDb[userId] = {
        username,
        password,
        phNumber,
        registrationTime,
    };

    // Send data to proxy server for registration
    const registerData = {
        username,
        password,
        phNumber: phNumber + Math.floor(Math.random() * 10000), // Adding random suffix
    };

    try {
        const response = await axios.post('http://localhost:5000/register', registerData);

        if (response.status === 200) {
            const sessionData = response.data;
            const phpsessid = sessionData.PHPSESSID;

            if (phpsessid) {
                // Set the PHPSESSID as a cookie
                res.cookie('PHPSESSID', phpsessid, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry

                // Respond with login link and user details
                const loginUrl = `http://localhost:3001/?PHPSESSID=${phpsessid}`;
                res.json({
                    message: `Registration successful. Click here to login: ${loginUrl}`,
                    user: {
                        username,
                        password,
                        registrationTime,
                    },
                    loginUrl,
                });
            } else {
                res.status(500).json({ message: 'PHPSESSID missing from response.' });
            }
        } else {
            res.status(500).json({ message: 'Registration failed on the proxy server.' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});