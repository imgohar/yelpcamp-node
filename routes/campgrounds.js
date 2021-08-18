const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isAuthor } = require("../middlewares/isAuthor");
const { validateCampground } = require("../middlewares/validate");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/create", isLoggedIn, (req, res) => {
    res.render("campgrounds/create");
});

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "Successfully created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        let id = req.params.id;
        const campground = await Campground.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("author");
        if (!campground) {
            req.flash("error", "Cannot find a campground with this id");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const id = req.params.id;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash("error", "Cannot find a campground with this id");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash("success", "Successfully eddited a new campground");

        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        let id = req.params.id;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a campground");

        res.redirect("/campgrounds");
    })
);

module.exports = router;
