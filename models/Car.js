const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Shema
const CarSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  current_mileage: {
    type: Number,
    required: true
  },
  fuel: {
    type: String
  },
  drivetrain: {
    type: String
  },
  exterior_color: {
    type: String
  },
  interior_fabric: {
    type: String
  },

  interior_color: {
    type: String
  },

  mileage_city: {
    type: Number,
    required: true
  },
  mileage_hwy: {
    type: Number,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  displayImagePath: {
    type: String
  },

  images: [
    {
      imageName: {
        type: String
      },
      imagePath: {
        type: String
      }
    }
  ],
  carfaxReportPath: {
    type: String,
    required: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [
    {
      commentBody: {
        type: String,
        required: true
      },
      commentDate: {
        type: Date,
        default: Date.now
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],

  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

// Create collection and add schema
mongoose.model("cars", CarSchema);
