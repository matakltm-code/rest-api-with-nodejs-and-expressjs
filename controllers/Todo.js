// const jwt = require("jsonwebtoken"),
//   secret = require("../config/env")["jwt_secret"];
const Todo = require("../models/Todo");

exports.createTodo = (req, res) => {
  try {
    const todo = new Todo({ ...req.body, userId: req.jwt.userId });
    todo.save((err, todo) => {
      if (err || !todo) {
        return res.status(400).json({
          error: "something went wrong: " + err,
        });
      }
      todo = todo.toJSON();
      delete todo.__v;
      res.json({ todo });
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.getTodoById = (req, res, next, todoId) => {
  Todo.findById(todoId).exec((err, todo) => {
    if (err || !todo) {
      return res.status(400).json({
        error: "404 todo not found",
      });
    }
    req.todo = todo;
    next();
  });
};
exports.getTodoByUserId = (req, res, next, userId) => {
  if (!userId) {
    return res.status(400).json({
      error: "404 user not found in our dataset",
    });
  }
  // store that todo in req.todo so that other functions can use it
  req.userId = userId;
  next();
};

exports.getAllUserTodos = (req, res) => {
  try {
    Todo.find({})
      .where("userId")
      .equals(req.userId)
      .sort("-createdAt")
      .exec((err, todos) => {
        if (err || !todos) {
          return res.status(400).json({
            error: "Something went wrong in finding and sorting all todos",
          });
        }
        res.json({ total: todos.length, data: todos });
      });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
exports.getAllTodos = (req, res) => {
  Todo.find()
    .sort("-createdAt")
    .exec((err, todos) => {
      if (err || !todos) {
        return res.status(400).json({
          error: "Something went wrong in finding and sorting all todos",
        });
      }
      res.json({ total: todos.length, data: todos });
    });
};

exports.getTodo = (req, res) => {
  try {
    if (req.todo.userId !== req.jwt.userId) {
      res.status(401).send();
    }

    return res.json(req.todo);
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.updateTodo = (req, res) => {
  try {
    if (req.todo.userId !== req.jwt.userId) {
      res.status(401).send();
    }
    req.todo.task = req.body.task;

    Todo.findOneAndUpdate({ _id: req.todo._id }, req.todo).catch((err) => {
      return res.status(400).json({
        error: "something went wrong while updating. " + err,
      });
    });
    return res.status(200).send({ updated: true, todo: req.todo });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};

exports.deleteTodo = (req, res) => {
  try {
    if (req.todo.userId !== req.jwt.userId) {
      res.status(401).send();
    }

    new Promise((resolve, reject) => {
      Todo.deleteMany({ _id: req.todo._id }, (err) => {
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
    return res.status(200).send({ deleted: true, todo: req.todo });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
