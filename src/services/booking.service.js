const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/appError');
const { Booking } = require('../models/index');

const createBooking = async (data) => {
  try {
    const booking = await BookingRepository.create(data);
    return booking;
  } catch (error) {
    console.log('error', error);
    throw new AppError(
      ['Something went wrong while creating booking'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createBooking };
