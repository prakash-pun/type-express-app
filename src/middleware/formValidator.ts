import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export default function authFunction (req: Request, res: Response, next: NextFunction) {
  const result = {}
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    errors.array().forEach((error) => {
      result[error.param] = error.msg;
    });
    return res.json({ "error": result });
  }
}