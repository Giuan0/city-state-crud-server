const httpStatus = require('http-status');
const mongoose = require('mongoose');
const mongoDB = require('mongodb');
const APIError = require("../error/APIError");
const ApplicationResponse = require('./ApplicationResponse');

/**
 * GenericCRUD, encapsulates simple CRUD operations to any given mongoose instance
 * model
 */
class GenericCRUD {
    constructor(modelInstance) {
        this.modelInstance = modelInstance;
    }

    /**
     * On find document pre processor
     * Can be used to populate any field before returning the response
     *
     * @param {Query} query - Reference to find document function, ex: findOne, findById
     * @returns {Query}
     */
    onFindDocument(query) {
        return query;
    }

    /**
     * On find documents pre processor
     * Can be used to populate any field before returning the response
     *
     * @param {Query} query - Reference to find documents function, ex: find, findMany
     * @returns {Query}
     */
    onFindDocuments(query) {
        return query;
    }

    /**
     * Insert document
     *
     * @param {Any} document - Deserialized document
     * @returns {Promise<ApplicationResponse>}
     */
    async insert(document) {
        try {
            const result = await this.modelInstance.create(document);
            const response = this.generateSuccessResponse(result);

            return response;
        } catch (e) {
            const response = this.generateFailedResponse(e);
            return response;
        }
    }

    /**
     * Update document
     *
     * @param {String} id - ID of document about to be updated
     * @param {Any} document - Modificated deserialized document
     * @returns {Promise<ApplicationResponse<string>>>}
     */
    async update(id, document) {
        try {
            if (this.isValid(id)) {
                const objId = mongoose.Types.ObjectId(id);
                const result = await this.modelInstance.updateOne({_id: objId}, {$set: document});

                if (result.n > 0) {
                    const response =
                        this.generateSuccessResponse("Document successfully updated");

                    return response;
                }

                throw new APIError('Document not found',
                    httpStatus.NOT_FOUND);
            } else {
                throw new APIError('Invalid ID',
                    httpStatus.BAD_REQUEST);
            }
        } catch (e) {
            const response = this.generateFailedResponse(e);
            return response;
        }
    }

    /**
     * Insert document
     *
     * @param {String} id - ID of document about to be removed
     * @returns {Promise<ApplicationResponse<string>>>}
     */
    async remove(id) {
        try {
            if (this.isValid(id)) {
                const objId = mongoose.Types.ObjectId(id);
                const result = await this.modelInstance.deleteOne({_id: objId});
                if (result.n > 0) {
                    const response =
                        this.generateSuccessResponse("Document successfully removed");

                    return response;
                }

                throw new APIError('Document not found',
                    httpStatus.NOT_FOUND);
            } else {
                throw new APIError('Invalid ID',
                    httpStatus.BAD_REQUEST);
            }
        } catch (e) {
            const response = this.generateFailedResponse(e);
            return response;
        }
    }

    /**
     * Get document
     *
     * @param {String} id - ID of desired document.
     * @returns {Promise<ApplicationResponse>}
     */
    async findById(id) {
        try {
            if (this.isValid(id)) {
                const objId = mongoose.Types.ObjectId(id);
                const document = await this.onFindDocument(this.modelInstance.findById(objId));
                if (document) {
                    const response = this.generateSuccessResponse(document);
                    return response;
                }

                throw new APIError('Document not found',
                    httpStatus.NOT_FOUND);
            } else {
                throw new APIError('Invalid ID',
                    httpStatus.BAD_REQUEST);
            }
        } catch (e) {
            const response = this.generateFailedResponse(e);
            return response;
        }
    }

    /**
     * Get all documents
     * @param {Any} search - Query options.
     * @returns {Promise<ApplicationResponse>}
     */
    async getAll(queryOptions) {
        try {
            const documents = await this.onFindDocuments(this.modelInstance.find(queryOptions));
            const response = this.generateSuccessResponse(documents);

            return response;
        } catch (e) {
            const response = this.generateFailedResponse(e);
            return response;
        }
    }

    /**
     * Check ID
     *
     * @param {String} id - Desired ID for checking.
     * @returns {boolean}
     */
    isValid(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    /**
     * Generate success response
     *
     * @param {Any} document - Deserialized document.
     * @returns {ApplicationResponse}
     */
    generateSuccessResponse(document) {
        const response = new ApplicationResponse(document);
        response.setStatusCode(httpStatus.OK);

        return response;
    }

    /**
     * Generate error response
     *
     * @param {Error} document - Error object.
     * @returns {ApplicationResponse}
     */
    generateFailedResponse(error) {
        // console.log(error);
        const response = new ApplicationResponse();
        response.setMessage(error.message);
        if (error instanceof APIError) {
            response.setStatusCode(error.getStatusCode());
        } else if (error instanceof mongoDB.MongoError) {
            if (error.code === 11000) {
                response.setMessage("Document already exists");
                response.setStatusCode(httpStatus.CONFLICT);
            }
        } else {
            response.setStatusCode(httpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }
}

module.exports = GenericCRUD;
