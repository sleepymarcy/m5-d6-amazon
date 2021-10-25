/* Extra method for product's image upload (POST /product/:id/upload)

Add an extra method to get all the reviews of a specific product (GET /products/:id/reviews)

GET /products?category=book => Filter by category, should return only products belonging to the specified category */
import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

import {
  getProducts,
  writeProducts,
  getReviews,
  writeReviews,
} from "./utils/fs-tools.js";
import multer from "multer";
import path from "path";

const productsRouter = express.Router();

productsRouter.post(
  "/:productId/upload",
  multer().single("picture"),
  async (req, res, next) => {
    try {
      console.log("REQ FILE ", req.file);
      //console.log(req);

      const pictureUrl = `http://localhost:3001/img/products/${req.file.originalname}`;
      const newProduct = {
        ...req.body,
        name: "",
        description,
        brand,
        imageUrl: pictureUrl,
        price,
        category,
        createdAt: new Date(),
        id: req.params.productId,
      };
      const products = await getProducts();
      products.push(newProduct);
      await saveProductsPictures(req.file.originalname, req.file.buffer);
      console.log(saveProductsPictures);
      await writeProducts(products);
      res.status(201).send(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(404, { errorsList }));
    } else {
      const products = await getProducts();
      const filteredProduct = products.filter(
        (product) => p.category === req.query.category
      );
      if (req.query && req.query.category) {
        res.send(filteredProduct);
      }
      res.send(products);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviews();

    /* const index = blogs.findIndex((b) => b._id === req.params.blogId);
    const blog = blogs[index]; */
    const review = reviews.find((r) => r._id === req.params.productId);
    /*    console.log(blogs[0]._id); */
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.productId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

/* 
"_id": "5d318e1a8541744830bef139", //SERVER GENERATED
        "name": "3310",  //REQUIRED
        "description": "somthing longer", //REQUIRED
        "brand": "nokia", //REQUIRED 	  
        "imageUrl":"https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80",
        "price": 100, //REQUIRED
        "category": "smartphones" //REQUIRED
        "createdAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
        "updatedAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED */
