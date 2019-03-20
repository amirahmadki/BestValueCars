const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
  googleID: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "/images/logo_user.png"
  },

  password: {
    type: String,
    required: false
  }
});

// Create collection and add schema
mongoose.model("users", UserSchema);
