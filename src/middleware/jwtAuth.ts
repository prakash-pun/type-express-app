import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { User } from 'entity/User';

export const authFunction = {
  generateJwt: (payload) => {
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    console.log(jwtToken)

    return jwtToken;
  },

  verifyLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.header("Authorization")) {
        return res.status(401).json({ "detail": "authenticaton credential not provided" });
      }
      const token = await req.header("Authorization").split(" ")[1];
      if (!token) {
        return res.status(401).json({ "detail": "token not provided" });
      }
      const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(userToken);
      // const user = await User.findByIds(userToken.userId);
      next();
    } catch {
      return res.status(400).json({ message: "error login" });
    }
  }
};

export default authFunction;
