import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import routes from 'routes/index';
import { TryDBConnect } from "config";


export default function createServer() {
  const app: Application = express();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
  }));

  app.use('/notes', express.static('notes'));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }));

  // app.use(express.json())
  
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    await TryDBConnect(() => {
      res.json({
        error: "Database connection error"
      });
    }, next);
  });

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  });

  app.use(routes);

  return app;
}
