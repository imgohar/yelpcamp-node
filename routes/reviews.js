const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utlis/catchAsync");
const { validateReview } = require("../middlewares/validate");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { isReviewAuthor } = require("../middlewares/isAuthor");
const ReviewController = require("../controllers/ReviewController");

router.post(
    "/",
    isLoggedIn,
    validateReview,
    catchAsync(ReviewController.create)
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(ReviewController.delete)
);

module.exports = router;
