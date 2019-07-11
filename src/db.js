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
    published: true,
    author: "2",
  },
];

const comments = [
  {
    id: "102",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    author: "3",
    post: "10",
  },
  {
    id: "103",
    text:
      "commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    author: "1",
    post: "10",
  },
  {
    id: "104",
    text: "commodo consequat. Duis aute irure dolor ",
    author: "2",
    post: "11",
  },
  {
    id: "105",
    text:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia d...",
    author: "1",
    post: "12",
  },
];

const database = {
  users,
  posts,
  comments,
};

export { database as default };
