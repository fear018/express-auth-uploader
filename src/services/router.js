const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/account/create", async (req, res, next) => {
  const user = await userController.createUser(req, res, next);
  res.status(200).json(user);
});

router.post("/account/signIn", async (req, res, next) => {
  const loginAndToken = await userController.signInUser(req, res, next);
  res.status(200).json(loginAndToken);
});

module.exports = router;
