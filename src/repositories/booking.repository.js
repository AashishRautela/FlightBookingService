const CrudRepository = require('./crud.repository.js');
const { Booking } = require('../models');

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const booking = await Booking.create(data, { transaction: transaction });
    return booking;
  }
}

module.exports = new BookingRepository();
