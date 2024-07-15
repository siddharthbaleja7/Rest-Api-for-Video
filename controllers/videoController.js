const { Video } = require('../models/video');
const { maxFileSize, minDuration, maxDuration } = require('../config');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');


ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
const uploadVideo = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  // Validate file size
  if (file.size > maxFileSize) {
    return res.status(400).send({ error: 'File is too large' });
  }

  const filePath = `uploads/${file.filename}`;

  try {
    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('FFprobe error:', err);
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });

    const duration = metadata.format.duration;

    if (duration < minDuration || duration > maxDuration) {
      return res.status(400).send({ error: `Video duration must be between ${minDuration} and ${maxDuration} seconds` });
    }

    // Save file metadata to the database
    const video = await Video.create({
      filename: file.filename,
      size: file.size,
      duration
    });

    res.send({ video });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).send({ error: 'Failed to process video', details: error.message });
  }
};
const trimVideo = async (req, res) => {
  try {
      const { id } = req.params;
      const { start, end } = req.body; // Expected in seconds

      console.log(`Trimming video ${id} from ${start}s to ${end}s`);

      const video = await Video.findByPk(id);
      if (!video) {
          return res.status(404).send({ error: 'Video not found' });
      }

      const inputPath = `uploads/${video.filename}`;
      const outputPath = `uploads/trimmed-${video.filename}`;

      if (!fs.existsSync(inputPath)) {
          return res.status(404).send({ error: 'Input file not found' });
      }

      console.log(`Input file: ${inputPath}`);
      console.log(`Output file: ${outputPath}`);

      ffmpeg(inputPath)
          .setStartTime(start)
          .setDuration(end - start)
          .output(outputPath)
          .on('start', (command) => {
              console.log('FFmpeg process started:', command);
          })
          .on('progress', (progress) => {
              console.log(`Processing: ${progress.percent}% done`);
          })
          .on('end', async () => {
              console.log('FFmpeg process completed');
              const stats = fs.statSync(outputPath);
              video.filename = `trimmed-${video.filename}`;
              video.size = stats.size;
              video.duration = end - start;
              await video.save();
              res.send({ video });
          })
          .on('error', (err) => {
              console.error('FFmpeg error:', err);
              res.status(500).send({ error: 'Error trimming video', details: err.message });
          })
          .run();
  } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).send({ error: 'Unexpected error occurred', details: error.message });
  }
};

const mergeVideos = async (req, res) => {
  const { ids } = req.body; // Array of video IDs to merge

  try {
    const videos = await Video.findAll({
      where: { id: ids }
    });

    if (videos.length !== ids.length) {
      return res.status(404).send({ error: 'One or more videos not found' });
    }

    const outputPath = `uploads/merged-${Date.now()}.mp4`;
    const ffmpegCommand = ffmpeg();

    videos.forEach((video) => {
      ffmpegCommand.input(`uploads/${video.filename}`);
    });

    ffmpegCommand
      .on('end', async () => {
        try {
          const stats = fs.statSync(outputPath);
          const mergedVideo = await Video.create({
            filename: `merged-${Date.now()}.mp4`,
            size: stats.size,
            duration: videos.reduce((acc, video) => acc + video.duration, 0)
          });
          res.send({ video: mergedVideo });
        } catch (error) {
          console.error('Error saving merged video to database:', error);
          res.status(500).send({ error: 'Error saving merged video to database' });
        }
      })
      .on('error', (err) => {
        console.error('Error during ffmpeg merge:', err);
        res.status(500).send({ error: 'Error merging videos' });
      })
      .mergeToFile(outputPath);
  } catch (error) {
    console.error('Error fetching videos from database:', error);
    res.status(500).send({ error: 'Error fetching videos from database' });
  }
};

const shareLink = async (req, res) => {
  const { id } = req.params;
  const { expiry } = req.body; // Expiry in seconds

  const video = await Video.findByPk(id);
  if (!video) {
    return res.status(404).send({ error: 'Video not found' });
  }
  
  const link = `http://localhost:3000/videos/${id}`;
 res.setHeader('Content-Disposition', 'attachment; filename=' + video.filename);
 res.setHeader('Content-Type', 'video/mp4');
  res.send({ link });
  // res.download(link);
};



// const verifyToken = async (req, res, next) => {
//   const authorization = req.headers.authorization;
//   const token = authorization && authorization.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).send({ error: 'Unauthorized' });
//   }

//   if (token !== 'Jethalal') {
//     return res.status(403).send({ error: 'Forbidden' });
//   }

//   next();
// };


module.exports = {
  uploadVideo,
  trimVideo,
  mergeVideos,
  shareLink,
  // verifyToken
};
