const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const createBooking = async (req, res) => {
  try {
    const booking = await BookingService.createBooking(req.body);
    SuccessResponse.data = booking;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { createBooking };
