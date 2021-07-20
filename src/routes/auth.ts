import { Router, Request, Response } from "express";
const { body, validationResult } = require('express-validator');
import { User } from "entity/User";
import jwtAuth from 'middleware/jwtAuth';
import { getRepository } from "typeorm";
import { validate, ValidationError } from "class-validator";
import loginValidation from "util/validation/loginValidation";
import { Result } from "express-validator";


const router = Router();

/**
 * @route GET /auth
 * @desc user authentication with jwt
 * @access Public
 */
router.get("/profile", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const userId = req.user.id;
  const user = await userRepository.findOne({where: {id: userId}});
  console.log(user);
  res.status(200).json(user);
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
      const duplicateUserName = await User.findOne({ userName: req.body.userName });
      if (duplicateUserName) {
        return res.status(400).json({ message: "username already exists" });
      }
      if (duplicateUser) {
        return res.status(400).json({ message: "email already exists" });
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


router.post("/login", loginValidation, async (req: Request, res: Response) => {
  try {
    const data: {
      email: string;
      password: string
    } = {
      email: req.body.email,
      password: req.body.password,
    }

    const errors: Result<ValidationError> = validationResult( req );
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const userRepository = getRepository(User);
    let user: User;

    user = await userRepository
      .createQueryBuilder( "user" )
      .addSelect( 'user.password' )
      .where( "user.email = :email", { email: data.email } )
      .getOne();

    if (user){
      const jwtUser = {
        userId: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        userEmail: user.email,
        origin: process.env.ORIGIN,
        services: process.env.SERVICES,
      }
      if (user.checkPasswordEncrypt(data.password)) {
        const jwt = jwtAuth.generateJwt(jwtUser);
        res.append("X-JWT", jwt);
        return res.status(200).json({jwt})
      } else {
        return res.status(400).json({"message": "password didn't match"})
      }
    }else{
      return res.status(400).json({"message": "invalid credential user not found"})
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({ message: "error login" });
  }
});


router.post("/change", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
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
  }

  // user from the database
  const userRepository = getRepository(User);
  let user: User;

  const errors: Result<ValidationError> = validationResult( req );
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
    user = await userRepository
    .createQueryBuilder( "user" )
    .addSelect( 'user.password' )
    .where( "user.id = :id", { id: id } )
    .getOne();
    console.log(user);
    if(!user){
      res.status(404).json({
        status: "error",
        message: "User not found",
      })
      return;
    }
    
    // check if old password match
    if (!user.checkPasswordEncrypt(data.old_password)){
      res.status(401).json({
        status: "Error",
        message: "Please enter old password"
      })
      return;
    }

    user.password = data.new_password;
    user.hashPassword();
    userRepository.save(user);
    return res.status( 204 ).json( {
        status: "Success",
        message: user,
    } );
    }
}) 


router.patch("/profile/change", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  let user: User;
  const userId = req.user.id;
  const userRepository = await getRepository(User);
  const userData: {
    firstName: string;
    lastName: string;
    userName: string;
  } = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
  };
  const errors: Result<ValidationError> = validationResult( req );
  
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }else{
    user = await userRepository.findOneOrFail(userId);
    if(!user){
      return res.status(401).json({status: "error", message: "user not found"});
    }
    userRepository.merge(user, userData);
    const result = await userRepository.save(user);
    return res.status(200).json(result);
  }
})


router.post("/signout", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  try{
    res.set(
      'Set-Cookie',
      ['token=; Max=age=0']
    )
    res.clearCookie("refresh_token");
    res.status(204).send({"detail": "logged out"});
  }catch (error){
    res.status(500).send(error)
  }
})

export default router;
