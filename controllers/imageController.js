const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';

        // Check if the folder exists, otherwise create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        cb(null, uploadDir); // Destination folder
    },
    filename: (req, file, cb) => {
        // Generate a unique file name based on the original file name
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // File name is current timestamp + file extension
    }
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

// Handle file upload in the controller
const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Construct the URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Send a success response with file details
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl, // Return the image URL
        file: req.file
    });
};

const deleteImage = (req, res) => {
    const { imageName } = req.params; // Get the image name from the URL parameters
    const filePath = path.resolve(__dirname, '..', 'uploads', imageName); // Use path.resolve to make sure the path is absolute
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting the file', error: err });
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    });
};

// Export the upload middleware and controller method
module.exports = {
    upload,
    uploadImage,
    deleteImage
};
