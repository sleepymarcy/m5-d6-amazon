import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import reviewsRoute from "./reviews/index.js";
import { badRequest, unAuthorized, notFound, genericError } from './reviews/errorHandlers.js'

const fname = fileURLToPath(import.meta.url)
const dname = dirname(fname)
const publicDirectory = path.join(dname, "../public")

const server = express();
const port = 3010;

server.use(cors());
server.use(express.json());
server.use(express.static(publicDirectory));
server.use('/reviews', reviewsRoute)
// server.use("/reviews",reviewsRoute)

 server.use(badRequest)
 server.use(unAuthorized)
 server.use(notFound)
 server.use(genericError)
 console.table(listEndpoints(server))

 console.log(listEndpoints(server))

server.listen(port, () => console.log("Port running: ", port));

server.on('error', (error) =>
    console.log(`Server is not running due to : ${error}`))