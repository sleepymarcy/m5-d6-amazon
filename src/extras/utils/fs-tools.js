import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/blogs");

const productsJSONPATH = join(dataFolderPath, "products.json");

const reviewsJSONPATH = join(dataFolderPath, "reviews.json");

export const getProducts = () => readJSON(productsJSONPATH);
export const writeProducts = (content) => writeJSON(dataFolderPath, content);

export const getReviews = () => readJSON(reviewsJSONPATH);
export const writeReviews = (content) => writeJSON(dataFolderPath, content);

export const saveProductsPictures = (filename, contentAsButter) =>
  writeFile(join(publicFolderPath, filename), contentAsButter);
