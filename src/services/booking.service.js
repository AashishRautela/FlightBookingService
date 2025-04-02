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

      const flightData = flight?.data?.data;
      if (!flightData) {
        throw new AppError(['Flight not found'], StatusCodes.BAD_REQUEST);
      }

      if (flightData.totalSeats < data.noOfSeats) {
        throw new AppError(
          ['Not enough seats remaining'],
          StatusCodes.BAD_REQUEST
        );
      }

      const totalCost = flightData.price * data.noOfSeats;

      const bookingPayload = {
        flightId: data.flightId,
        userId: data.userId,
        totalCost,
        noOfSeats: data.noOfSeats,
        status: 'pending'
      };

      let bookingEntry = await BookingRepository.createBooking(
        bookingPayload,
        t
      );

      const seatResponse = await axios.patch(
        `${flightService}/api/v1/flight/${data.flightId}/seats`,
        {
          seats: data.noOfSeats,
          dec: true
        }
      );
      console.log('seatResponse', seatResponse);

      if (!seatResponse?.data?.success) {
        throw new AppError(
          ['Failed to reserve seats in flight'],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      bookingEntry.status = 'booked';
      await bookingEntry.save();
      return bookingEntry;
    });

    return booking;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log('error', error);
    throw new AppError(
      ['Something went wrong while creating booking'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createBooking };
