import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from './resolvers';

const typeDefs = `
  type Note {
    id: ID
    title: String
    subTitle: String
    tags: String
    content: String
    noteShare: Boolean
    owner: [User]
  }

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
    getNote(id: ID): Note
  }

  input NoteInput{
    id: ID
    title: String
    subTitle: String
    tags: String
    content: String
    noteShare: Boolean
  }

  type Mutation {
    createNote(input: NoteInput): Note
    updateNote(input: NoteInput): Note
  }
`

const schemaNote = makeExecutableSchema({ typeDefs, resolvers });

export { schemaNote };