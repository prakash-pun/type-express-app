// import { UserModel } from "../../src/user/user.model";
import {User} from "../../src/entity/User";

declare global{
    namespace Express {
        interface Request {
          user: User
        }
    }
}
