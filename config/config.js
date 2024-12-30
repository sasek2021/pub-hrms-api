require('dotenv').config(); // Load environment variables

const config = {
    email: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    jwtSecret: process.env.JWT_SECRET
};

module.exports = config;
