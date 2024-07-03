const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const fileController = require('./controllers/fileController');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to database
connectDB();
const conn = mongoose.connection;
fileController.initGFS(conn);

// Routes
app.use('/', fileRoutes);

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
