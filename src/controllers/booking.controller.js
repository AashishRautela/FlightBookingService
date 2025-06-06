const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const AppError = require('../utils/errors/appError');

const createBooking = async (req, res) => {
  try {
    const { flightId, userId, noOfSeats } = req.body;

    if (!flightId || !userId || !noOfSeats) {
      ErrorResponse.message = 'Something went wrong while creating booking ';
      ErrorResponse.error = new AppError(
        ['Request data missing'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const booking = await BookingService.createBooking({
      flightId,
      userId,
      noOfSeats
    });
    SuccessResponse.data = booking;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const makePayment = async (req, res) => {
  try {
    const { bookingId, userId, totalCost } = req.body;

    if (!bookingId || !userId || !totalCost) {
      ErrorResponse.message = 'Something went wrong while making payment';
      ErrorResponse.error = new AppError(
        ['Request data missing'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    const booking = await BookingService.makePayment({
      bookingId,
      userId,
      totalCost
    });
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await BookingService.cancelBooking(bookingId);
    SuccessResponse.data = {};
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings();
    SuccessResponse.data = bookings;

    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { createBooking, makePayment, cancelBooking, getAllBookings };
