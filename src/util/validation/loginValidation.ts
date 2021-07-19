import { check } from "express-validator";

export default [
    check("email").isEmail(),
    check("password").isLength({ min: 8, max:25 })
      .withMessage('password must be betwen 8 to 20 character'),
];