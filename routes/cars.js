const express = require("express");
const router = express.Router();
//const confirm = require("confirm-dailog");
const mongoose = require("mongoose");
const Car = mongoose.model("cars");
const User = mongoose.model("users");
var multer = require("multer");
//const nodeMailer = require("nodemailer");
var upload = multer({ dest: "public/photos/images" });
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const nodeMailer = require("nodemailer");

const S3_BUCKET = process.env.S3_BUCKET || "bestvaluecars";

var storage = multer.diskStorage({
  destination: "public/photos/images",
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  Car.find()
    .populate("user")
    .then(cars => {
      res.render("cars/index", { cars: cars });
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("cars/add");
});

router.get("/my/", ensureAuthenticated, (req, res) => {
  Car.find({ user: req.user.id })
    .populate("user")
    .then(cars => {
      res.render("cars/index", { cars: cars });
    });
});

router.post("/", (req, res) => {
  var imagepath = "/photos/images/";

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
  if (req.body.images.length > 0) {
    if (Array.isArray(req.body.images)) {
      req.body.images.forEach(element => {
        const imageName = {
          imageName: `${element}`,
          imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${element}`
        };

        if (i == 0) {
          newCar.displayImagePath = `https://${S3_BUCKET}.s3.amazonaws.com/${element}`;
          // nodemon.log(newCar.displayImagePath);
          i = i + 1;
        }
        i++;
        newCar.images.push(imageName);
      });
    } else {
      const imageName = {
        imageName: `${req.body.images}`,
        imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${req.body.images}`
      };

      if (i == 0) {
        newCar.displayImagePath = `https://${S3_BUCKET}.s3.amazonaws.com/${
          req.body.images
        }`;
        // nodemon.log(newCar.displayImagePath);
        i = i + 1;
      }
      i++;
      newCar.images.push(imageName);
    }
  }

  new Car(newCar).save().then(car => {
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

router.put("/:id", (req, res) => {
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
      numberofImages = car.images.length;
      car.images.splice(0, numberofImages);

      if (Array.isArray(req.body.imagestokeep)) {
        req.body.imagestokeep.forEach(element => {
          const imageName = {
            imageName: `${element}`,
            imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${element}`
          };
          car.images.push(imageName);
        });
      } else {
        const imageName = {
          imageName: req.body.imagestokeep,
          imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${
            req.body.imagestokeep
          }`
        };
        car.images.push(imageName);
      }

      if (req.body.images.length > 0) {
        if (Array.isArray(req.body.images)) {
          req.body.images.forEach(element => {
            const imageName = {
              imageName: `${element}`,
              imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${element}`
            };

            if (i == 0) {
              car.displayImagePath = `https://${S3_BUCKET}.s3.amazonaws.com/${element}`;
              // nodemon.log(newCar.displayImagePath);
              i = i + 1;
            }
            i++;
            car.images.push(imageName);
          });
        } else {
          const imageName = {
            imageName: req.body.images,
            imagePath: `https://${S3_BUCKET}.s3.amazonaws.com/${
              req.body.images
            }`
          };

          if (i == 0) {
            car.displayImagePath = `https://${S3_BUCKET}.s3.amazonaws.com/${
              req.body.images
            }`;
            // nodemon.log(newCar.displayImagePath);
            i = i + 1;
          }
          car.images.push(imageName);
        }
      }
      car.save().then(car => {
        req.flash("success_msg", " Car Information edited Successfully");
        res.redirect(`/cars/show/${car.id}`);
      });
    });
});

router.get("/show/:id", (req, res) => {
  Car.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(car => {
      var url = req.protocol + "://" + req.get("host") + req.originalUrl;
      show_fb = true;
      res.render("cars/show", { car: car, url: url, show_fb: show_fb });
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Car.findOne({ _id: req.params.id })
    .populate("user")
    .then(car => {
      res.render("cars/edit", { car: car });
    });
});

router.delete("/:id", (req, res) => {
  Car.remove({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

router.post("/contact/:id", (req, res) => {
  Car.findOne({ _id: req.params.id })
    .populate("user")
    .then(car => {
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        secure: true, // true for 465, false for other ports
        auth: {
          user: "mailtobestvaluecars@gmail.com", // generated ethereal user
          pass: "19Dec1977" // generated ethereal password
        }
      });

      let mailOptions = {
        from: "mailtobestvaluecars@gmail.com", // sender address
        to: car.user.email, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body, // plain text body
        html: req.body.body // html body
      };

      // send mail with defined transport object
      let info = transporter.sendMail(mailOptions);
      req.flash("success_msg", "Email Sent to the seller successfully");
      var url = req.protocol + "://" + req.get("host") + req.originalUrl;
      res.redirect("/cars");
    });
});

router.post("/comment/:id", (req, res) => {
  Car.findOne({ _id: req.params.id }).then(car => {
    const newcomment = {
      commentBody: req.body.commentBody,
      commentUser: req.user
    };
    car.comments.unshift(newcomment);
    car.save().then(story => {
      res.redirect(`/cars/show/${car.id}`);
    });
  });
});

module.exports = router;
