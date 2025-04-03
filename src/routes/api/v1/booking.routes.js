const router = require('express').Router();
const { BookingController } = require('../../../controllers');

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getAllBookings);
router.post('/payment', BookingController.makePayment);
router.delete('/:bookingId', BookingController.cancelBooking);

module.exports = router;
