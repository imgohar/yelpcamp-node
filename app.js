const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const Campground = require("./models/campground");

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

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/create", (req, res) => {
    res.render("campgrounds/create");
});

app.post("/campgrounds", async (req, res, next) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
        next(error);
    }
});

app.get("/campgrounds/:id", async (req, res) => {
    let id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    let id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.use((err, req, res, next) => {
    res.send("lol");
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
