import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import routes from 'routes/index';
import mongoose from 'mongoose';
import config from 'config/dbConfig';


export default function createServer() {
  const app: Application = express();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
  }));

  app.use('/notes', express.static('notes'));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }));

  // app.use(express.json())
  
  mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error)
  });

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  });

  app.use(routes);

  return app;
}
