const startCancelBookingCron = require('./cancelBookings.js');
const { logger } = require('../config');

const initializeSchedulers = async () => {
  try {
    startCancelBookingCron();
    logger.info('All schedulers have been initialized.');
  } catch (error) {
    logger.error('Error initializing schedulers:', error);
  }
};

module.exports = initializeSchedulers;
