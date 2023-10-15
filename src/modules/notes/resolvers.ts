import Notes from "../../models/Notes";
import User from "../../models/User";

const resolvers = {
  Query: {
    getNote: ({ id }: any) => {
      return new Promise((resolve, object) => {
        Notes.findById(id, (err: any, user: unknown) => {
          if (err) console.log(err);
          else resolve(user);
        });
      });
    },
    getUser: (root: any, { id }: any) => {
      return new Promise((resolve, object) => {
        User.findById(id, (err: any, user: unknown) => {
          if (err) console.log(err);
          else resolve(user);
        });
      });
    },
  },
};

export { resolvers };
