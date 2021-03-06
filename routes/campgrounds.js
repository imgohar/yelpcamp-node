const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const CampgroundController = require("../controllers/CampgroudController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isAuthor } = require("../middlewares/isAuthor");
const { validateCampground } = require("../middlewares/validate");
const { storage } = require("../cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });

router
    .route("/")
    .get(catchAsync(CampgroundController.index))
    .post(
        isLoggedIn,
        upload.array("campground[image]"),
        validateCampground,
        catchAsync(CampgroundController.create)
    );

router.get("/create", isLoggedIn, CampgroundController.createForm);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(CampgroundController.edit)
);

router
    .route("/:id")
    .get(catchAsync(CampgroundController.show))
    .put(
        isLoggedIn,
        isAuthor,
        upload.array("campground[image]"),
        validateCampground,
        catchAsync(CampgroundController.update)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(CampgroundController.delete));

module.exports = router;
