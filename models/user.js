const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, //this will be a reference to the product model (id)
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ], //items will be an array of objects
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
