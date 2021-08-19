const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.createForm = (req, res) => {
    res.render("campgrounds/create");
};

module.exports.create = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
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
};

module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find a campground with this id");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully eddited a new campground");

    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
    let id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground");

    res.redirect("/campgrounds");
};
