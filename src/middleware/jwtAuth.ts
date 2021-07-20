import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { User } from 'entity/User';

export const authFunction = {
  generateJwt: (payload) => {
    let refreshTokens = []
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60), });
    console.log(jwtToken)
    // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
    // refreshTokens.push(refreshToken)
    return jwtToken;
  },

  verifyLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.header("Authorization")) {
        return res.status(401).json({ "detail": "authenticaton credential not provided" });
      }
      const token = await req.header("Authorization").split(" ")[1];
      if (!token) {
        return res.status(401).json({ detail: "token not provided" });
      }
      const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decode) => {
        if (err) return res.status(403).json({"detail": "invalid token"})
        const user = await User.findOne({id: decode.userId});
        if (user){
          req.user = user;
          next();
        }else{
          return res.status(401).json({ "detail": "invalid token. user not found" });
        }
      });
    } catch {
      return res.status(401).json({ message: "error login" });
    }
  }
};

export default authFunction;
// const refreshTokens = refreshToken.filter(token => token !== req.body.token);