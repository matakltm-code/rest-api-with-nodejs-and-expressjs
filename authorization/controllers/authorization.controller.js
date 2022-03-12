const jwtSecret = require("../../config/env.js").jwt_secret,
  jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uuid = require("uuid");
const config = require("../../config/env");
const User = require("../../models/User");

const ADMIN = config.permissionLevels.ADMIN;
const NORMAL_USER = config.permissionLevels.NORMAL_USER;

exports.registerAdminUser = (req, res) => {
  try {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = ADMIN;

    const user = new User(req.body);

    user.save((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "something went wrong",
        });
      }
      res.status(201).send({
        accountCreated: true,
        id: user._id,
        message: `Account for ${user.firstName} ${user.lastName} created please login to your account.`,
      });
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
exports.registerNormalUser = (req, res) => {
  try {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = NORMAL_USER;

    const user = new User(req.body);

    user.save((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "something went wrong",
        });
      }
      res.status(201).send({
        accountCreated: true,
        id: user._id,
        message: `Account for ${user.firstName} ${user.lastName} created please login to your account.`,
      });
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.login = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, jwtSecret);
    let b = Buffer.from(hash);
    let refresh_token = b.toString("base64");
    res.status(201).send({ accessToken: token, refreshToken: refresh_token });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.refresh_token = (req, res) => {
  try {
    req.body = req.jwt;
    let token = jwt.sign(req.body, jwtSecret);
    res.status(201).send({ id: token });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
