const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

const AuthorizationRouter = require("./authorization/routes.config");

// we will create these todoRoutes in the future
const userRoutes = require("./routes/Users");
const todoRoutes = require("./routes/Todo");

// middleware for cors to allow cross origin resource sharing
app.use(cors());

// DB connection
mongoose
  .connect(
    "mongodb+srv://username:bMvmivHJawfDW9zl@cluster0.ghxa9.mongodb.net/todosdb?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("CONNECTED TO DATABASE");
  })
  .catch((e) => {
    console.log("Mongo Catch: ", e);
  });

// middleware to convert our request data into JSON format
app.use(bodyParser.json());

AuthorizationRouter.routesConfig(app);

// include the todoRoutes
app.use("/api", userRoutes);
app.use("/api", todoRoutes);

app.get("/", (req, res) => {
  res.sendFile(require("path").join(__dirname + "/index.html"));
});

app.listen(port, () => {
  console.log(`Todos app listening on http://localhost:${port}`);
});
