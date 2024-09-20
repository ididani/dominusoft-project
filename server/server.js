const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const contactRoute = require("./routes/contactRoute");
const path = require("path");
const app = express();
const axios = require('axios');

app.use(cors());

app.use(
  session({
    secret: "This will be secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.json({ limit: "1000mb", extended: true }));
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(
    "mongodb+srv://anxdidani:dominusoft@cluster0.oxrc6.mongodb.net/Final?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("Something is wrong", err));

app.listen(5000, () => {
  console.log("Server Created!");
});

app.use(contactRoute);

const messageController = (req, res) => {
  res.send("<h1>Hello Node!</h1>");
};
app.use("/", messageController);
