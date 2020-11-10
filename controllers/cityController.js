const CityCRUD = require('../helpers/CityCRUD');
const cityCrud = new CityCRUD();

// same logic for both controllers,
// I will not abstract the behavior, since modifications to this layer are quite common
exports.getCity = async (req, res, next) => {
    const cityId = req.params.cityId;

    const response = await cityCrud.findById(cityId);
    return res.status(response.getStatusCode()).json(response);
}

exports.getCities = async (req, res, next) => {
    const search = req.query.name;
    let queryOptions = {};
    if (search) {
        queryOptions = {name: {$regex: search, $options: 'i'}};
    }

    const response = await cityCrud.getAll(queryOptions);
    return res.status(response.getStatusCode()).json(response);
}

exports.postCity = async (req, res, next) => {
    const body = req.body;

    const response = await cityCrud.insert(body);
    return res.status(response.getStatusCode()).json(response);
}

exports.putCity = async (req, res, next) => {
    const cityId = req.params.cityId;
    const body = req.body;

    const response = await cityCrud.update(cityId, body);
    return res.status(response.getStatusCode()).json(response);
}

exports.deleteCity = async (req, res, next) => {
    const cityId = req.params.cityId;

    const response = await cityCrud.remove(cityId);
    return res.status(response.getStatusCode()).json(response);
}
