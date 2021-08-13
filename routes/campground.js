const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utlis/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/create", (req, res) => {
    res.render("campgrounds/create");
});

router.post(
    "/",
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash("success", "Successfully created a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        let id = req.params.id;
        const campground = await Campground.findById(id).populate("reviews");
        if (!campground) {
            req.flash("error", "Cannot find a campground with this id");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
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
    catchAsync(async (req, res) => {
        let id = req.params.id;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a campground");

        res.redirect("/campgrounds");
    })
);

module.exports = router;
