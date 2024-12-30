const express = require('express');
const router = express.Router();
const { upload, uploadImage, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

// Define the route for image upload
router.post('/upload',authMiddleware, upload.single('image'), uploadImage);

// Route to delete an image
router.delete('/delete-image/:imageName',authMiddleware, deleteImage);

module.exports = router;
