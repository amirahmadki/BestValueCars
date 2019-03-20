const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

const mongoose = require("mongoose");
const Car = mongoose.model("cars");
const User = mongoose.model("users");
//const nodeMailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("index/welcome");
});

/* router.get("/dashboard", (req, res) => {
  Car.find()
  res.render("index/dashboard");
}); */

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Car.find({ user: req.user.id }).then(cars => {
    res.render("index/dashboard", { cars: cars });
  });
});

module.exports = router;
