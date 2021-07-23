import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildSchema, GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";
import { resolvers } from './resolvers';
import User from '../../models/User';

const typeDefs = `
  type User {
    id: ID
    firstName: String
    lastName: String
    userName: String
    email: String
    password: String
  }

  type Query {
    getUser(id: ID): User
  }

  input UserInput {
    id: ID
    firstName: String
    lastName: String
    userName: String
    email: String
    password: String 
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(input: UserInput): User
    deleteUser(id: ID!): String
  }
`

// implement same API using GraphQL schema Language

// Define the User Type
const usertype = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: usertype,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: GraphQLString }
      },
      resolve: (_, { id }) => {
        return User.findById(id);
      },
    },
  }
})

const schema = makeExecutableSchema({ typeDefs, resolvers });

const userSchema = new GraphQLSchema({ query: queryType });

export { schema, userSchema };