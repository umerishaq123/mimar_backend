const express = require('express');
const router = express.Router();
const { getWeather, getQuote } = require('../conttrollers/weather_quotes_controller');


router.get('/weather/:city', getWeather);
router.get('/quote', getQuote);

module.exports = router;