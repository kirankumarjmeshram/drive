const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

let gfs;

const initGFS = (conn) => {
  conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });
};

const uploadFile = (req, res) => {
  
  return res.json({ file: req.file });
};

const getFiles = (req, res) => {
  // res.json("Hello World")
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'No files exist' });
    }
    return res.json(files);
  });
};

const deleteFile = (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err) => {
    if (err) {
      return res.status(404).json({ err });
    }
    res.json({ success: true });
  });
};

module.exports = {
  initGFS,
  uploadFile,
  getFiles,
  deleteFile
};
