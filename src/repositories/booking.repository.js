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

  async get(data, transaction) {
    const response = await this.model.findByPk(data, {
      transaction: transaction
    });
    if (!response) {
      throw new AppError(['Resouce Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async update(id, data, transaction) {
    const response = await this.model.update(data, {
      where: {
        id: id
      },
      transaction: transaction
    });
    if (!response[0]) {
      throw new AppError(['Resouce Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = new BookingRepository();
