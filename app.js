const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

const dbURI =
  "mongodb+srv://admin:123321@practice.lls3e.mongodb.net/task5?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log(err));

const app = express();

app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is ready to receive requests")
);

app.use(express.static("public")).use(express.urlencoded({ extended: true }));

app
  .get("/", (req, res) => {
    res.redirect("/users");
  })
  .get("/users", async (req, res) => {
    const users = await User.find();
    res.render("users", { users });
  })
  .get("/users/create", (req, res) => {
    res.render("create");
  })
  .post("/users", async (req, res) => {
    const user = new User(req.body);

    await user.save();
    res.redirect("/users");
  })
  .post("/users/:id", async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;

    await User.updateOne({ _id: id }, { password });
    res.redirect("/users");
  })
  .delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    if (id !== "600023a67f48702860122a6b") {
      await User.findByIdAndDelete(id);
      res.json({ redirect: "/users" });
    }
  });

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
