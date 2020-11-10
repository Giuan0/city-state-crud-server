const mongoose = require('mongoose');
const stateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Please enter a full name'],
            index: true,
        },
        abbreviation: {
            type: String,
            unique: true,
            required: [true, 'Please enter a short name'],
            index: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('State', stateSchema);