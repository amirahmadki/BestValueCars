const express = require("express");
const router = express.Router();
//const confirm = require("confirm-dailog");
const mongoose = require("mongoose");
const Car = mongoose.model("cars");
const User = mongoose.model("users");
var multer = require("multer");
//const nodeMailer = require("nodemailer");
var upload = multer({ dest: "public/photos/upload" });
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

var storage = multer.diskStorage({
  destination: "public/photos/upload",
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  //console.log(req.user);
  Car.find()
    .populate("user")
    .then(cars => {
      res.render("cars/index", { cars: cars });
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("cars/add");
});

router.post("/", upload.array("images", 10), (req, res) => {
  var imagepath = "/photos/upload/";

  var newCar = new Car({
    title: req.body.title,
    mileage_city: req.body.mileage_city,
    mileage_hwy: req.body.mileage_hwy,
    style: req.body.style,
    engine: req.body.engine,
    price: req.body.price,
    body: req.body.body,
    fuel: req.body.fuel,
    drivetrain: req.body.drivetrain,
    exterior_color: req.body.exterior_color,
    interior_color: req.body.interior_color,
    interior_fabric: req.body.interior_fabric,
    current_mileage: req.body.current_mileage,
    user: req.user.id,
    displayImagePath: ""
  });
  var i = 0;
  req.files.forEach(element => {
    const image = {
      imagePath: "/photos/upload/" + element.originalname
    };

    if (i == 0) {
      newCar.displayImagePath = "/photos/upload/" + element.originalname;
      // nodemon.log(newCar.displayImagePath);
      i = i + 1;
    }
    i++;
    newCar.images.push(image);
  });

  new Car(newCar).save().then(car => {
    //console.log(newCar);
    req.flash("success_msg", "New Car added Successfully");
    res.redirect(`/cars/show/${car.id}`);
  });
});

router.get("/my/", ensureAuthenticated, (req, res) => {
  Car.find({ user: req.user.id })
    .populate("user")
    .then(cars => {
      res.render("cars/index", { cars: cars });
    });
});

router.put("/:id", upload.array("images", 10), (req, res) => {
  var imagepath = "/photos/upload/";

  Car.findOne({ _id: req.params.id })
    .populate("user")
    .then(car => {
      car.title = req.body.title;
      car.mileage_city = req.body.mileage_city;
      car.mileage_hwy = req.body.mileage_hwy;
      car.style = req.body.style;
      car.engine = req.body.engine;
      car.price = req.body.price;
      car.body = req.body.body;
      car.fuel = req.body.fuel;
      car.drivetrain = req.body.drivetrain;
      car.exterior_color = req.body.exterior_color;
      car.interior_color = req.body.interior_color;
      car.interior_fabric = req.body.interior_fabric;
      car.current_mileage = req.body.current_mileage;
      car.displayImagePath = "";

      var i = 0;
      req.files.forEach(element => {
        const image = {
          imagePath: "/photos/upload/" + element.originalname
        };

        if (i == 0) {
          car.displayImagePath = "/photos/upload/" + element.originalname;
          // nodemon.log(newCar.displayImagePath);
          i = i + 1;
        }
        i++;
        car.images.push(image);
      });

      car.save().then(car => {
        //console.log(newCar);
        req.flash("success_msg", " Car Information edited Successfully");
        res.redirect(`/cars/show/${car.id}`);
      });
    });
});

router.get("/show/:id", (req, res) => {
  Car.findOne({ _id: req.params.id })
    .populate("user")
    .then(car => {
      var url = req.protocol + "://" + req.get("host") + req.originalUrl;
      //console.log(url);
      res.render("cars/show", { car: car, url: url });
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Car.findOne({ _id: req.params.id })
    .populate("user")
    .then(car => {
      //console.log(car.description);
      res.render("cars/edit", { car: car });
    });
});

router.delete("/:id", (req, res) => {
  Car.remove({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

module.exports = router;
