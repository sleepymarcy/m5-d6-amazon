import express from 'express'
import fs from 'fs-extra'
import uniqid from 'uniqid'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { productsValidation } from './validation.js'
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

const fname = fileURLToPath(import.meta.url)
const dname = dirname(fname)

export const productsFilePath = path.join(dname, '../data/products.json')

const productsRoute = express.Router()


productsRoute.get('/', async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJSON = JSON.parse(fileAsString)
        res.send(fileAsJSON)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productsRoute.post('/', productsValidation, async (req, res, next) => {
    try {
        const errorList = validationResult(req)

        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }));
        } else {
            const { name, description, brand, price, category, imageUrl } = req.body

            const product = {
                id: uniqid(),
                name,
                description,
                brand,
                price,
                category,
                imageUrl,
                createdAt: new Date(),
            }

            const fileAsBuffer = fs.readFileSync(productsFilePath)
            const fileAsString = fileAsBuffer.toString()
            const fileAsJSONArray = JSON.parse(fileAsString)

            fileAsJSONArray.push(product)
            fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJSONArray))

            res.send(product)
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productsRoute.get('/:id', async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJSONArray = JSON.parse(fileAsString)

        const product = fileAsJSONArray.find(
            (product) => product.id === req.params.id
        )

        if (!product) {
            res
                .status(404)
                .send({ message: `Product with ${req.params.id} is not found :(` })
        }
        res.send(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productsRoute.delete('/:id', async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        let fileAsJSONArray = JSON.parse(fileAsString)

        const product = fileAsJSONArray.find(
            (product) => product.id === req.params.id
        )
        if (!product) {
            res
                .status(404)
                .send({ message: `Product with ${req.params.id} is not found :( ` })
        }
        fileAsJSONArray = fileAsJSONArray.filter(
            (product) => product.id !== req.params.id
        )
        fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJSONArray))
        res.status(204).send()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productsRoute.put('/:id', async (req, res, next) => {
    try {
        const errorList = validationResult(req)

        if (!errorList.isEmpty()) {
            next(createHttpError(400, { errorList }));
        } else {

            const fileAsBuffer = fs.readFileSync(productsFilePath)
            const fileAsString = fileAsBuffer.toString()
            let fileAsJSONArray = JSON.parse(fileAsString)

            const productIndex = fileAsJSONArray.findIndex(
                (product) => product.id === req.params.id
            )
            if (!productIndex == -1) {
                res
                    .status(404)
                    .send({ message: `Product with ${req.params.id} is not found :( ` })
            }
            const previousProductData = fileAsJSONArray[productIndex]
            const changedProduct = {
                ...previousProductData,
                ...req.body,
                updatedAt: new Date(),
                id: req.params.id,
            }
            fileAsJSONArray[productIndex] = changedProduct

            fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJSONArray))
            res.send(changedProduct)
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

export default productsRoute