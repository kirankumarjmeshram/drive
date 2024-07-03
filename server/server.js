const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5001;

// Enable CORS
app.use(cors());

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/fileUploads';

// Create mongo connection
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const conn = mongoose.connection;
let gfs;

// Initialize GridFS
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');

  const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
  

  const upload = multer({ storage });
  app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }
    console.log("File uploaded successfully!")
    res.send('File uploaded successfully!');
  });
//   app.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).send('No files were uploaded.');
//     }
//     console.log("File uploaded successfully!")
//     res.send('File uploaded successfully!');
//   });

  // Route to get files
  app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

      return res.json(files);
    });
  });

  // Route to get specific file by filename
  app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      return res.json(file);
    });
  });

  // Route to download a file
  app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

});

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
