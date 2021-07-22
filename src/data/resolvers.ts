import User from '../models/User';

const resolvers = {
  Query: {
    getUser: (root, { id }) => {
      return new Promise((resolve, object) => {
        User.findById(id, (err, user) => {
          if (err) console.log(err)
          else resolve(user);
        });
      });
    }
  },
  Mutation: {
    createUser: (root, { input }) => {
      const newUser = new User({
        firstName: input.firstName,
        lastName: input.lastName,
        userName: input.userName,
        email: input.email,
        password: input.password
      })
      newUser.id = newUser._id;

      return new Promise((resolve, object) => {
        newUser.save((err) => {
          if (err) throw (err)
          else resolve(newUser)
        })
      })
    },
    updateUser: (root, { input }) => {
      return new Promise((resolve, object) => {
        User.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, user) => {
          if (err) throw (err)
          else resolve(user)
        })
      })
    },
    deleteUser: (root, { id }) => {
      return new Promise((resolve, object) => {
        User.remove({ _id: id }, (err) => {
          if (err) throw (err)
          else resolve('Successfully deleted user')
        })
      })
    }
  },
};

export { resolvers };
