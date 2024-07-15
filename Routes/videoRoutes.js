const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadVideo, trimVideo, mergeVideos, shareLink } = require('../controllers/videoController');
const router = express.Router();
const token = require('../middlewares/authenticate');


// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/upload', upload.single('video'), uploadVideo);
router.post('/trim/:id', trimVideo);
router.post('/merge', mergeVideos);
router.post('/share/:id',token,shareLink);

module.exports = router;
