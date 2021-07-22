// import { UserModel } from "../../src/user/user.model";
import {User} from "../../src/model/User";

declare global{
    namespace Express {
        interface Request {
          user: User
        }
    }
}
