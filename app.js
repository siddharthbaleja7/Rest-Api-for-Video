const express = require('express');
const { sequelize } = require('./models/video');
const videoRoutes = require('./Routes/videoRoutes');
const authenticate = require('./middlewares/authenticate');

const app = express();
const port = 3000;

app.use(express.json());
app.use(authenticate);

// Video routes
app.use('/videos', videoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, async () => {
  await sequelize.sync(); // Sync database
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
