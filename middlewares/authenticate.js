const { apiToken } = require('../config');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (token === apiToken) {
    next();
  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
};
module.exports = authenticate;
