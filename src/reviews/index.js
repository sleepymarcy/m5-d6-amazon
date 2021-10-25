import express from 'express';
import {reviewsValidation} from './validation.js';
import { getReviews, writeReviews } from './db.js';
import createHttpError from "http-errors";
import uniqid from 'uniqid';


const reviewsRoute = express.Router()


reviewsRoute.get("/", reviewsValidation, async(req, res, next) => {
try {
    const reviews = await getReviews()
    res.status(200).send(reviews)
} catch (error) {
    next(error)
}
})

reviewsRoute.get("/:id", reviewsValidation, async(req, res, next) => {
    try {
       const reviews = await getReviews()

       const review = reviews.find(r => r.id === req.params.id)
       if(review){
        res.status(200).send(review)   
       } else {
       next(createHttpError(404, `review with id ${req.params.id} not found`))
       }
    } catch (error) {
        next(error)
    }
})

reviewsRoute.post("/", reviewsValidation, async(req, res, next) => {
    try {
        
        const newReview = {
            id: uniqid(),
            ...req.body,
            productId: uniqid(),
            createdAt: new Date()
        }
        
        const reviews = await getReviews()

        reviews.push(newReview)
        await writeReviews(reviews)
        res.status(201).send(newReview)
    } catch (error) {
        next(error)
    }
})

reviewsRoute.put("/:id", reviewsValidation, async(req, res, next) => {
    try {
        const reviews = await getReviews()

        const review = reviews.find(r => r.id === req.params.id)
        const 
    } catch (error) {
        next(error)
    }
})

export default reviewsRoute