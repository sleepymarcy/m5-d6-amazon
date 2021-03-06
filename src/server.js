import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import productsRouter from './products/index.js'
// import reviewsRoute from "./reviews/index.js"
import { badRequestHandler, notFoundHandler,forbiddenErrorHandler, internalServerErrorHandler } from './reviews/errorHandlers.js'

const fname = fileURLToPath(import.meta.url)
const dname = dirname(fname)
const publicDirectory = path.join(dname, "../public")

const server = express();
const port = 3010;

server.use(cors());
server.use(express.json());
server.use(express.static(publicDirectory));
// server.use('/products', productsRouter)
// server.use("/reviews",reviewsRoute)

 server.use(badRequestHandler)
 server.use(notFoundHandler)
 server.use(forbiddenErrorHandler)
 server.use(internalServerErrorHandler)
 console.table(listEndpoints(server))

 console.log(listEndpoints(server))

server.listen(port, () => console.log("Port running: ", port));

server.on('error', (error) =>
    console.log(`Server is not running due to : ${error}`))