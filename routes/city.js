const express = require('express');
const router = express.Router();
const {cityPostValidation} = require('../validation/validators');

const {
    getCity,
    getCities,
    putCity,
    postCity,
    deleteCity
} = require('../controllers/cityController');

router
    .get('/', getCities)
    .get('/:cityId', getCity)
    .post('/', cityPostValidation, postCity)
    .put('/:cityId', putCity)
    .delete('/:cityId', deleteCity);

module.exports = router;
