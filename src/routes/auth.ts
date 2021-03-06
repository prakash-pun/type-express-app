import { Router, Request, Response } from "express";
const { body, validationResult } = require("express-validator");
import jwtAuth from "../middleware/jwtAuth";
import { validate, ValidationError } from "class-validator";
import loginValidation from "../util/validation/loginValidation";
import { Result } from "express-validator";
import User, { IUser } from "../models/User";

const router = Router();

/**
 * @route GET /auth
 * @desc user authentication with jwt
 * @access Public
 */
router.get(
  "/profile",
  jwtAuth.verifyLogin,
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
  }
);

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 character"),
  ],
  async (req: Request, res: Response) => {
    try {
      const userData: {
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
        password: string;
      } = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
      };
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const duplicateUser = await User.findOne({ email: req.body.email });
      const duplicateUserName = await User.findOne({
        userName: req.body.userName,
      });
      if (duplicateUserName)
        return res.status(400).json({ message: "username already exists" });
      if (duplicateUser)
        return res.status(400).json({ message: "email already exists" });

      const newUser: IUser = new User(userData);
      newUser.password = await newUser.encryptPassword(newUser.password);

      const result = await newUser.save();
      console.log(result);

      return res.status(201).json(result);
    } catch (e) {
      console.log(e);
      const errors = validationResult(req);
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

router.post("/login", loginValidation, async (req: Request, res: Response) => {
  try {
    const data: {
      email: string;
      password: string;
    } = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let user: IUser;
    user = await User.findOne({ email: data.email });

    if (user) {
      const jwtUser = {
        userId: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        userEmail: user.email,
        origin: process.env.ORIGIN,
        services: process.env.SERVICES,
      };
      if (user.checkPasswordEncrypt(data.password)) {
        const jwt = jwtAuth.generateJwt(jwtUser);
        res.append("X-JWT", jwt);
        return res.status(200).json({ jwt });
      } else {
        return res.status(400).json({ message: "password didn't match" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "invalid credential user not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "error login" });
  }
});

router.post(
  "/change",
  jwtAuth.verifyLogin,
  async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = req.user.id;
    const data: {
      old_password: string;
      new_password: string;
      confirm_new_password: string;
    } = {
      old_password: req.body.old_password,
      new_password: req.body.new_password,
      confirm_new_password: req.body.confirm_new_password,
    };

    // user from the database
    let user: IUser;

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      user = await User.findById(id);
      console.log(user);
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      // check if old password match
      if (!user.checkPasswordEncrypt(data.old_password)) {
        res.status(401).json({
          status: "Error",
          message: "Please enter old password",
        });
        return;
      }

      user.password = data.new_password;
      user.encryptPassword(data.new_password);
      user.save();
      return res.status(204).json({
        status: "Success",
        message: user,
      });
    }
  }
);

router.patch(
  "/profile/change",
  jwtAuth.verifyLogin,
  async (req: Request, res: Response) => {
    let user: IUser;
    const userId = req.user.id;

    const userData: {
      firstName: string;
      lastName: string;
      userName: string;
    } = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
    };
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    } else {
      user = await User.findById(userId);
      if (!user)
        return res
          .status(401)
          .json({ status: "error", message: "user not found" });
      const data: IUser = req.body;
      const patchUser = User.findByIdAndUpdate(userId, data, { new: true });
      const result = await user.save();
      console.log(patchUser);
      return res.status(200).json(result);
    }
  }
);

router.post(
  "/signout",
  jwtAuth.verifyLogin,
  async (req: Request, res: Response) => {
    try {
      res.set("Set-Cookie", ["token=; Max=age=0"]);
      res.clearCookie("refresh_token");
      res.status(204).send({ detail: "logged out" });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;
