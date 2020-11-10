class ApplicationResponse {
    data;
    message = "";
    #statusCode = 0;

    constructor (data) {
        this.data = data;
    }

    setMessage(message) {
        this.message = message;
    }

    setStatusCode(statusCode) {
        this.#statusCode = statusCode;
    }

    getStatusCode() {
        return this.#statusCode;
    }
}

module.exports = ApplicationResponse;