class APIError extends Error {
    #statusCode;

    constructor(message, statusCode) {
        super(message);
        this.#statusCode = statusCode;
        this.name = "APIError";

        Object.setPrototypeOf(this, new.target.prototype);
    }

    getStatusCode() {
        return this.#statusCode;
    }
}

module.exports = APIError;