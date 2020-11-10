const StateCRUD = require("../helpers/StateCRUD");
const stateCrud = new StateCRUD();

// same logic for both controllers,
// I will not abstract the behavior, since modifications to this layer are quite common
exports.getState = async (req, res, next) => {
    const stateId = req.params.stateId;

    const response = await stateCrud.findById(stateId);
    return res.status(response.getStatusCode()).json(response);
}

exports.getStates = async (req, res, next) => {
    const search = req.query.name;
    let queryOptions = {};
    if (search) {
        queryOptions = {name: {$regex: search, $options: 'i'}};
    }

    const response = await stateCrud.getAll(queryOptions);
    return res.status(response.getStatusCode()).json(response);
}

exports.postState = async (req, res, next) => {
    const body = req.body;

    const response = await stateCrud.insert(body);
    return res.status(response.getStatusCode()).json(response);
}

exports.putState = async (req, res, next) => {
    const stateId = req.params.stateId;
    const body = req.body;

    const response = await stateCrud.update(stateId, body);
    return res.status(response.getStatusCode()).json(response);
}

exports.deleteState = async (req, res, next) => {
    const stateId = req.params.stateId;

    const response = await stateCrud.remove(stateId);
    return res.status(response.getStatusCode()).json(response);
}
