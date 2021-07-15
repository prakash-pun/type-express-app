import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import routes from 'routes/index';

export default function createServer() {
  const app: Application = express();

  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
  }));

  app.use(express.json())

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  });

  app.use(routes);

  return app;
}
