const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", ReviewSchema);
