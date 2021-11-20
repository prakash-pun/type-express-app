// import { UserModel } from "../../src/user/user.model";
import { IUser } from "../../src/models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
