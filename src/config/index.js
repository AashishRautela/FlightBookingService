require('dotenv').config();
const logger = require('./logger.config.js');

module.exports = {
  ServerConfig: require('./server.config.js'),
  logger
};
