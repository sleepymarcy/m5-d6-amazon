import fs from 'fs-extra';
import { fileURLToPath } from 'url'
import { dirname, join, } from 'path'

const { readJSON, writeJSON, writeFile} = fs 

export const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
console.log(dataFolderPath)

const reviewsJSONPath = join(dataFolderPath, 'reviews.json')
console.log(reviewsJSONPath)
const productsJSONPath = join(dataFolderPath, 'products.json')

export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = content => writeJSON(reviewsJSONPath, content)

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = content => writeJSON(productsJSONPath, content)