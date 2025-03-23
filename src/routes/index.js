const apiRoutes = require('./api');

const express = require('express');
const router = express.Router();

router.use('/', apiRoutes);

module.exports = router;
