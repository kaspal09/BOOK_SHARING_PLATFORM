const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);