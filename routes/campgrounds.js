const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const CampgroundController = require("../controllers/CampgroudController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isAuthor } = require("../middlewares/isAuthor");
const { validateCampground } = require("../middlewares/validate");

router.get("/", catchAsync(CampgroundController.index));

router.get("/create", isLoggedIn, CampgroundController.createForm);

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(CampgroundController.create)
);

router.get("/:id", catchAsync(CampgroundController.show));

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(CampgroundController.edit)
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(CampgroundController.update)
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(CampgroundController.delete)
);

module.exports = router;
