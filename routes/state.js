const express = require('express');
const router = express.Router();
const { statePostValidation } = require('../validation/validators');

const {
    getState,
    getStates,
    putState,
    postState,
    deleteState
} = require('../controllers/stateController');

router
    .get('/', getStates)
    .get('/:stateId', getState)
    .post('/', statePostValidation, postState)
    .put('/:stateId', putState)
    .delete('/:stateId', deleteState);

module.exports = router;
