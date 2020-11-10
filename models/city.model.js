const mongoose = require('mongoose');
const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a full name'],
            index: true,
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
            required: true
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('City', citySchema);