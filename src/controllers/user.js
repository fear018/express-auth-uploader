const { v4: uuid } = require("uuid");
const CustomError = require("../utils/customError");
const userModel = require("../models/user");
// const { parseJsonBody } = require("../utils/jsonHelpers");
const { createPasswordHash } = require("../utils/encription");
// const { HttpError } = require("../utils/custom-errors");
const jwt = require("../services/jwt");

exports.createUser = async (req, res, next) => {
  const { password, ...user } = req.body;
  user.id = uuid();

  if (!user.login || !password) {
    next(
      new CustomError({
        message: "login and password are required",
        statusCode: 400,
      })
    );
  }

  const passwordHash = await createPasswordHash(password);
  const isUserAdded = await userModel.addNewUser({
    ...user,
    password: passwordHash,
  });

  if (isUserAdded) {
    return user;
  } else {
    next(new CustomError({ message: "user is exist", statusCode: 400 }));
  }
};

exports.signInUser = async (req, res, next) => {
  const user = req.body;
  if (!user || !user.login || !user.password) {
    next(
      new CustomError({
        message: "login and password are required",
        statusCode: 400,
      })
    );
  }

  const { password, ...userBody } = await userModel.fetchUserByLogin(
    user.login
  );
  if (!userBody) {
    next(new CustomError({ message: "user not found", statusCode: 400 }));
  }

  const currentPasswordHash = await createPasswordHash(user.password);
  if (password !== currentPasswordHash) {
    next(new CustomError({ message: "incorrect password", statusCode: 400 }));
  }

  return { login: user.login, token: jwt.sign(userBody) };
};

// exports.logoutUser = async (req, res) => {
//   const userData = await parseJsonBody(req);
//   if (!userData || !userData.login) {
//     throw new HttpError();
//   }

//   const { password, ...userBody } = await userModel.fetchUserByLogin(
//     userData.login
//   );
//   if (!userBody) {
//     throw new HttpError();
//   }

//   if (userData.login !== userBody.login) {
//     throw new HttpError();
//   }

//   return { token: jwt.logout(userBody) };
// };
