const GenericCRUD = require("./GenericCRUD");
const City = require('../models/city.model');
const State = require('../models/state.model');

/**
 * StateCRUD, changes generic logic to add State specific logic
 */
class StateCRUD extends GenericCRUD {
    constructor() {
        super(State);
    }

    // TODO: make new layer to handle model logic
    async remove(id) {
        const result = await super.remove(id);
        // remove all cities with state reference
        const cityRemovalResult = await City.deleteMany({state: id});
        return result;
    }
}

module.exports = StateCRUD;
