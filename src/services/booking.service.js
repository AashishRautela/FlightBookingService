const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/appError');
const db = require('../models');
const { default: axios } = require('axios');
const { ServerConfig } = require('../config');

const createBooking = async (data) => {
  try {
    const flightService = ServerConfig.FLIGHT_SERVICE;

    const booking = await db.sequelize.transaction(async (t) => {
      const flight = await axios.get(
        `${flightService}/api/v1/flight/${data.flightId}`
      );

      // first check if flight is present or not
      if (!flight || !flight.data || !flight.data.data) {
        throw new AppError(['Flight not found'], StatusCodes.BAD_REQUEST);
      }

      const flightData = flight?.data?.data;
      // check if seats are available in flight or not
      if (flightData?.totalSeats < data?.noOfSeats) {
        const error = new AppError(
          ['Not enough seats remaining'],
          StatusCodes.BAD_REQUEST
        );
        throw error;
      }

      return flight.data.data;
    });

    return booking;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log('error', error);
    throw new AppError(
      ['Something went wrong while creating booking'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createBooking };
