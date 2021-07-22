import { makeExecutableSchema } from "@graphql-tools/schema";
import {resolvers} from './resolvers';

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

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };