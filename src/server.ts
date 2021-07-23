import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import routes from 'routes/index';
import config from 'config/dbConfig';
import { schema, userSchema } from "modules/data/schema";
import { schemaNote } from "modules/notes/schema";

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
    res.send("Hello World 😁");
  });

  const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('ip:', req.ip);
    console.log('ip:', req.url);
    console.log('ip:', req.ips);
    next();
  }

  app.use(loggingMiddleware);
  app.use('/graphqlUser', graphqlHTTP({
    schema: schema,
    graphiql: true
  }))

  app.use('/graphqlNote', graphqlHTTP({
    schema: schemaNote,
    graphiql: true
  }))

  app.use(routes);

  return app;
}

// 60f8f6d1dc38e804306a343d
// query{
//   getNote(id: "60f907d6be33381fc0a0915a"){
//     owner{
//       firstName
//     }
// }
// query{
//   getUser (id: "60f8f6d1dc38e804306a343d"){
//    firstName
//  }
//  }