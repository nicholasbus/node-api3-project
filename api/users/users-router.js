const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
// The middleware functions also need to be required
const mw = require("../middleware/middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const allUsers = await Users.get();
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/:id", mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post("/", mw.validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.put("/:id", mw.validateUserId, mw.validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  try {
    const updated = await Users.update(id, req.body);

    if (updated === 1) {
      const updatedUser = await Users.getById(id);
      res.status(201).json(updatedUser);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.delete("/:id", mw.validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  try {
    const deletedUser = await Users.remove(id);
    res.status(200).json(req.user);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/:id/posts", mw.validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;

  try {
    const userPosts = await Users.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.post(
  "/:id/posts",
  mw.validateUserId,
  mw.validatePost,
  async (req, res) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    const { id } = req.params;
    try {
      const newPost = await Posts.insert({ text: req.body.text, user_id: id });
      res.status(201).json(newPost);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
);

// do not forget to export the router
module.exports = router;
