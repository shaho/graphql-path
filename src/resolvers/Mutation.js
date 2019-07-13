import uuid from "uuid/v4";

const Mutation = {
  //
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email is already taken");
    }

    const user = {
      id: uuid(),
      ...args.data,
    };
    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found.");
    }

    const deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUser[0];
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id);
    if (!user) throw new Error("User not found");

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) throw new Error("Email taken");
      user.email = data.email;
    }

    if (typeof data.name === "string") user.name = data.name;

    if (typeof data.age !== "undefined") user.age = data.age;

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error("User not found!");
    }

    const post = {
      id: uuid(),
      ...args.data,
    };
    db.posts.push(post);

    // Implement new post subscription, if post has been created and published
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    // const deletedPost = db.posts.splice(postIndex, 1);
    // Destructering returened array which contains only one element
    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },

  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };
    if (!post) throw new Error("Post not found");

    if (typeof data.title === "string") post.title = data.title;
    if (typeof data.body === "string") post.body = data.body;

    if (typeof data.published === "boolean") {
      post.published = data.published;

      // Delete post
      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
        // Create post
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }

      // Update post
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some((post) => {
      return post.id === args.data.post && post.published;
    });

    if (!userExist || !postExist) {
      throw new Error("User or Post not found.");
    }

    const comment = {
      id: uuid(),
      ...args.data,
    };
    db.comments.push(comment);

    // Implement subscription comment
    // This would be run if a specified - published - post has a new comment
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id,
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },

  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof data.text === "string") comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
