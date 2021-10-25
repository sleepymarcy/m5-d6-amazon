import express from "express";
import { reviewsValidation } from "./validation.js";
import { getReviews, writeReviews } from "./db.js";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import uniqid from "uniqid";


const reviewsRoute = express.Router();

// Get all the reviews
reviewsRoute.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    if (reviews) {
      res.status(200).send(reviews);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

// Get single review
reviewsRoute.get("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();

    const review = reviews.find((r) => r.id === req.params.id);
    if (review) {
      res.status(200).send(review);
    } else {
      next(createHttpError(404, `review with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// Post a new review
reviewsRoute.post("/:id/", reviewsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      const newReview = {
        id: uniqid(),
        ...req.body,
        productId: req.params.id,
        createdAt: new Date(),
      };

      const reviews = await getReviews();

      reviews.push(newReview);
      await writeReviews(reviews);
      res.status(201).send(newReview);
    }
  } catch (error) {
    next(error);
  }
});

// To delete a review
reviewsRoute.delete("/:id", reviewsValidation, async (req, res, next) => {
  try {
    const reviews = await getReviews();

    const reviewsleft = reviews.filter((r) => r.id !== req.params.id);

    await writeReviews(reviewsleft);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// To update/edit a review
reviewsRoute.put("/:id", reviewsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req);

    if (!errorList.isEmpty()) {
      next(createHttpError(400, { errorList }));
    } else {
      const reviews = await getReviews();
      const index = reviews.findIndex((r) => r.id === req.params.id);

      const editedReviews = {
        ...reviews[index],
        ...req.body,
        updatedAt: new Date(),
      };

      reviews[index] = editedReviews;
      await writeReviews(reviews);
      res.status(203).send(editedReviews);
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRoute;
