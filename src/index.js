import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Type defenintions (Schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    me: User!
    post: Post!
    test: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: "1242423",
        name: "Shaho Toofani",
        email: "shaho@ymail.com",
      };
    },
    post() {
      return {
        id: "wr54",
        title: "Yet another post",
        body: "Lorem ipsum dolla wera lajfaf sdfsf",
        published: false,
      };
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name}! Pos:${args.position}`;
      } else {
        return "Hello";
      }
    },
    /* eslint-disable */
    test() {
      //
    },
    /* eslint-enable */
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log("The server is up");
});
