const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer'); // Ensure correct path
const fileController = require('../controllers/fileController'); // Ensure correct path

// Upload file
router.post('/upload', multer.single('file'), fileController.uploadFile);

// Get all files
router.get('/files', fileController.getFiles);

// Delete file by ID
router.delete('/files/:id', fileController.deleteFile);

module.exports = router;
