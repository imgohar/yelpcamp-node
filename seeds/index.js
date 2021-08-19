const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: "https://res.cloudinary.com/dovyropin/image/upload/v1629341885/YelpCamp/fzszkvtkiosrtskrkvh9.jpg",
                    filename: "YelpCamp/fzszkvtkiosrtskrkvh9",
                },
                {
                    url: "https://res.cloudinary.com/dovyropin/image/upload/v1629341895/YelpCamp/msjeowf0xf0n7tf5bc7e.jpg",
                    filename: "YelpCamp/msjeowf0xf0n7tf5bc7e",
                },
            ],
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt vel aut nostrum beatae animi, minus provident nobis possimus eligendi neque eius optio ea placeat vitae ducimus. Suscipit labore repudiandae repellat?",
            price: price,
            author: "611a199ccf44a7a24f3e71d6",
        });
        await camp.save();
    }
};

seedDb().then(() => {
    console.log("Seeding Complete");
    mongoose.connection.close();
});
