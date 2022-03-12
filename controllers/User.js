const User = require("../models/User");
const crypto = require("crypto");

exports.getUserById = (req, res, next, userId) => {
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "404 user not found",
      });
    }
    req.user = user;
    next();
  });
};

exports.getAllUsers = (req, res) => {
  User.find()
    .sort("-createdAt")
    .exec((err, users) => {
      if (err || !users) {
        return res.status(400).json({
          error: "Something went wrong in finding and sorting all users",
        });
      }
      let usersList = users.map((user) => {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
      res.json({ total: usersList.length, data: usersList });
    });
};

exports.getUser = (req, res) => {
  return res.json(req.user);
};

exports.updateUser = (req, res) => {
  try {
    const user = req.user;

    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto
        .createHmac("sha512", salt)
        .update(req.body.password)
        .digest("base64");
      req.body.password = salt + "$" + hash;
    }

    User.findOneAndUpdate({ _id: user._id }, user).catch((err) => {
      return res.status(400).json({
        error: "something went wrong while updating. " + err,
      });
    });
    return res.status(200).send({ updated: true, updatedUser: user });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const user = req.user;
    new Promise((resolve, reject) => {
      User.deleteMany({ _id: user._id }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      });
    }).catch((err) => {
      return res.status(400).json({
        error: "something went wrong while updating. " + err,
      });
    });
    return res.status(200).send({ deleted: true, deletedUser: user });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
