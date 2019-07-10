import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1",
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2",
  },
];

let comments = [
  {
    id: "1",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text:
      "commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text: "commodo consequat. Duis aute irure dolor ",
    author: "2",
    post: "2",
  },
  {
    id: "4",
    text:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia d...",
    author: "3",
    post: "2",
  },
];

// Type defenintions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
    

    test: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    //
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

    comments(parent, args, ctx, info) {
      return comments;
    },

    // ////////////////
    // Will be removed:START
    // ////////////////
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
    // ////////////////
    // Will be removed:END
    // ////////////////
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },

  User: {
    posts(parent, args, ctx, info) {
      // return posts.filter((post) => {
      //   return post.author === parent.id;
      // });
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log("The server is up");
});
