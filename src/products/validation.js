import { body } from "express-validator";

export const productsValidation = [
    body("name").exists().withMessage("Name is required!"),
    body("description").exists().withMessage("Description is required!"),
    body("brand").exists().withMessage("Brand is required!"),
    body("price").exists().withMessage("Price is required!"),
    body("category").exists().withMessage("Category is required!"),
    body("imageUrl").exists().withMessage("ImageUrl is required!"),
];