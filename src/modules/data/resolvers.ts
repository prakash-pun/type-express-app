import User from "../../models/User";

const resolvers = {
  Query: {
    getUser: ({ id }: any) => {
      return new Promise((resolve, object) => {
        User.findById(id, (err: any, user: unknown) => {
          if (err) console.log(err);
          else resolve(user);
        });
      });
    },
  },
  Mutation: {
    createUser: (root: any, { input }: any) => {
      const newUser = new User({
        firstName: input.firstName,
        lastName: input.lastName,
        userName: input.userName,
        email: input.email,
        password: input.password,
      });
      newUser.id = newUser._id;

      return new Promise((resolve, object) => {
        newUser.save((err) => {
          if (err) throw err;
          else resolve(newUser);
        });
      });
    },

    updateUser: (root: any, { input }: any) => {
      return new Promise((resolve, object) => {
        User.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true },
          (err, user) => {
            if (err) throw err;
            else resolve(user);
          }
        );
      });
    },
    deleteUser: (root: any, { id }: any) => {
      return new Promise((resolve, object) => {
        User.remove({ _id: id }, (err) => {
          if (err) throw err;
          else resolve("Successfully deleted user");
        });
      });
    },
  },
};

export { resolvers };
