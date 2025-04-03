const router = require('express').Router();
const { BookingController } = require('../../../controllers');

router.post('/', BookingController.createBooking);
router.post('/payment', BookingController.makePayment);

module.exports = router;
