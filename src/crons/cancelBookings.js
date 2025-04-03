const cron = require('node-cron');
const { logger } = require('../config');
const { BookingService } = require('../services');

const cancelBookings = async () => {
  try {
    logger.info('Cancel bookings job started');
    const timestamp = new Date(Date.now() - 20 * 60 * 1000);
    const bookings = await BookingService.cancelOldBookings(timestamp);
    logger.info('Cancel bookings job ended');
  } catch (error) {
    logger.error(`Error in cancelBookings: ${error.stack || error.message}`);
  }
};

const startCancelBookingCron = () => {
  logger.info('✅ Cancel booking cron initialized');

  const job = cron.schedule('*/5 * * * * *', () => {
    logger.info('⏰ Running cancelBookings cron job every 10 minutes');
    cancelBookings();
  });

  return job;
};

module.exports = startCancelBookingCron;
