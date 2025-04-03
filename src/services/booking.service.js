const { StatusCodes } = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const AppError = require('../utils/errors/appError');
const db = require('../models');
const { default: axios } = require('axios');
const { ServerConfig } = require('../config');
const { Enums } = require('../utils/common');
const moment = require('moment');
const { BOOKED, INITIATED, CANCELLED } = Enums.BOOKING_STATUS;

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
        noOfSeats: data.noOfSeats
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

      if (!seatResponse?.data?.success) {
        throw new AppError(
          ['Failed to reserve seats in flight'],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
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

const makePayment = async (data) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    const bookingDetails = await BookingRepository.get(
      data.bookingId,
      transaction
    );

    console.log('bookingDetails', bookingDetails);
    if (bookingDetails?.status == CANCELLED) {
      throw new AppError(
        ['The booking has been cancelled'],
        StatusCodes.BAD_REQUEST
      );
    }

    const createdAt = moment(bookingDetails?.createdAt);
    const now = moment();
    const expiresAt = createdAt.clone().add(20, 'minutes');

    if (now.isAfter(expiresAt)) {
      throw new AppError(
        ['The booking has been cancelled'],
        StatusCodes.BAD_REQUEST
      );
    }

    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError(
        ['The amount of payment does not match'],
        StatusCodes.BAD_REQUEST
      );
    }

    if (bookingDetails.userId !== data.userId) {
      throw new AppError(
        ['The user does not match with corresponding details'],
        StatusCodes.BAD_REQUEST
      );
    }

    // payment is successful
    const updatedBooking = await BookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      transaction
    );

    await transaction.commit();
    return updatedBooking;
  } catch (error) {
    console.log('error', error);

    if (transaction) {
      try {
        await transaction.rollback();
        console.log('after rollback');
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
      }
    }

    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while processing the payment'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const cancelBooking = async (data) => {
  try {
    const flightService = ServerConfig.FLIGHT_SERVICE;
    const booking = await db.sequelize.transaction(async (t) => {
      const bookingDetails = await BookingRepository.get(data, t);

      if (bookingDetails.status === CANCELLED) {
        return true;
      }
      const updatedBooking = await BookingRepository.update(
        data,
        { status: CANCELLED },
        t
      );

      let seatResponse;
      if (updatedBooking) {
        seatResponse = await axios.patch(
          `${flightService}/api/v1/flight/${bookingDetails.flightId}/seats`,
          {
            seats: bookingDetails.noOfSeats
          }
        );
      }

      if (!seatResponse?.data?.success) {
        throw new AppError(
          ['Failed to cancel the booking'],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      return true;
    });
    return booking;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log('error', error);
    throw new AppError(
      ['Something went wrong while booking cancellation'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createBooking, makePayment, cancelBooking };
