const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
//const confirm = require("confirm-dailog");
//const moment = require("moment");
//const nodeMailer = require("nodemailer");
const aws = require("aws-sdk");

const app = express();
const keys = require("./config/keys");
//Load Models
require("./models/Car");
require("./models/User");
require("./config/passport")(passport);
require("./config/passportlocal")(passport);

const S3_BUCKET = keys.S3_BUCKET;

//load routes
const index = require("./routes/index");
const cars = require("./routes/cars");
const auth = require("./routes/auth");
const users = require("./routes/users");

// DB CONNECTION CODE
// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require("./helpers/hbs");

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Set global vars
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/cars", cars);
app.use("/auth", auth);
app.use("/users", users);

app.post("/s3-delete", (req, res) => {
  console.log("App js s3 delete call");
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const imageid = req.query["image-id"];
  const carid = req.params.id;
  console.log(imageid);
  console.log(carid);

  var params = {
    Bucket: S3_BUCKET,
    Key: fileName
  };
  s3.deleteObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      //alert(err);
    } else {
      //alert("success");
      console.log(data);
    } // successful response
  });
});

app.get("/sign-s3", (req, res) => {
  //console.log(S3_BUCKET);
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: "bestvaluecars",
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
