const router = require('express').Router();
const { BookingController } = require('../../../controllers');

router.post('/', BookingController.createBooking);

module.exports = router;
