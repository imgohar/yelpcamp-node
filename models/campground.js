const mongoose = require("mongoose");

const CampgroundSchema = mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});


module.exports = mongoose.model('Campground',CampgroundSchema);