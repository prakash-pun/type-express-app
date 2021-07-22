import Notes from '../../models/Notes';
import User from '../../models/User';

const resolvers = {
  Query: {
    getNote: (root, { id }) => {
      return new Promise((resolve, object) => {
        Notes.findById(id, (err, user) => {
          if (err) console.log(err)
          else resolve(user);
        });
      });
    },
    getUser: (root, { id }) => {
      return new Promise((resolve, object) => {
        User.findById(id, (err, user) => {
          if (err) console.log(err)
          else resolve(user);
        });
      });
    }
  },
}

export { resolvers };