const GenericCRUD = require("./GenericCRUD");
const City = require('../models/city.model');
const ApplicationResponse = require("./ApplicationResponse");
const httpStatus = require('http-status');

/**
 * CityCRUD, changes generic logic to add Model specific logic
 */
class CityCRUD extends GenericCRUD {
    constructor() {
        super(City);
    }

    async insert(document) {
        const documentExists = await this.modelInstance.exists(document);
        if (documentExists) {
            const response = new ApplicationResponse();
            response.setMessage("Document already exists");
            response.setStatusCode(httpStatus.CONFLICT);
            return response;
        } else {
            return super.insert(document);
        }
    }

    async update(id, document) {
        const documentExists = await this.modelInstance.exists(document);
        if (documentExists) {
            const response = new ApplicationResponse();
            response.setMessage("Document already exists");
            response.setStatusCode(httpStatus.CONFLICT);
            return response;
        } else {
            return super.update(id, document);
        }
    }

    // populate documents after query
    onFindDocument(query) {
        return query.populate('state');
    }

    onFindDocuments(query) {
        return query.populate('state');
    }
}

module.exports = CityCRUD;
