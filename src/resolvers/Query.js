const Query = {
  //
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  //
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return isTitleMatch || isBodyMatch;
    });
  },

  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export { Query as default };
