import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Dummy user data
const users = [
  {
    id: "1",
    name: "Shaho",
    email: "shaho@ymail.com",
    age: 39,
  },
  {
    id: "2",
    name: "Andrew",
    email: "me@mead.io",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@test.com",
  },
];

const posts = [
  {
    id: "1",
    title: "Post 1",
    body: "Post body 1",
    published: true,
  },
  {
    id: "2",
    title: "Post 2",
    body: "Post body 2",
    published: false,
  },
  {
    id: "3",
    title: "Post 3",
    body: "Post body 3",
    published: true,
  },
];

// Type defenintions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    //
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },

    //
    me() {
      return {
        id: "1242423",
        name: "Shaho Toofani",
        email: "shaho@ymail.com",
      };
    },

    //
    post() {
      return {
        id: "wr54",
        title: "Yet another post",
        body: "Lorem ipsum dolla wera lajfaf sdfsf",
        published: false,
      };
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
