const express = require('express');
const router = express.Router();

const BookingRoutes = require('./booking.routes.js');

router.use('/booking', BookingRoutes);

module.exports = router;
