const CrudRepository = require('./crud.repository.js');
const { Booking } = require('../models');

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }
}

module.exports = new BookingRepository();
