import { Router, Request, Response } from "express";
const { body, validationResult } = require('express-validator');
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { User } from "entity/User";
import checkValidation from 'middleware/formValidator';
import jwtAuth from 'middleware/jwtAuth';


const router = Router();

/**
 * @route GET /auth
 * @desc user authentication with jwt
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  const users = await User.find()
  res.json(users);
})

router.post("/register",
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be between 8 and 20 character')
  ], async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const duplicateUser = await User.findOne({ email: req.body.email });
      const duplicateUserName = await User.findOne({ userName: req.body.userName });
      if (duplicateUserName) {
        return res.status(400).json({ message: "username already exists" });
      }
      if (duplicateUser) {
        return res.status(400).json({ message: "email already exists" });
      }
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 8),
      }
      const user = await User.create(userData);
      const result = await User.save(user);
      console.log(result);
      console.log(userData);

      return res.status(201).json(result);
    } catch (e) {
      console.log(e)
      const errors = validationResult(req);
      return res.status(400).json({errors: errors.array()})
    }
});

router.post("/login",
  [
    body('email')
      .exists()
      .withMessage('email required')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .exists()
      .withMessage('password required')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be between 8 and 20 character')
  ],checkValidation, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      
      if (bcrypt.compareSync(password, user.password)) {
        console.log(user.email);
        const jwt = jwtAuth.generateJwt({ userId: user.id, userName: user.userName });
        res.append("X-JWT", jwt);
        return res.status(200).json({jwt})
      } else {
        return res.status(400).json({"message": "password didn't match"})
      }
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: "error login" });
    }
});

router.post("/signout", jwtAuth.verifyLogin, (req: Request, res: Response) => {
  // req.session = null;
  res.status(200).send({});
})

export default router;
