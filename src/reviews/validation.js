import { body } from "express-validator";

export const reviewsValidation = [
    body("comment").exists().withMessage("Comment is required!"),
    body("rate").exists().withMessage("Rate is required!"),
];