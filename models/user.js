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

//* Instance methods
//Now all the user instances will have addToCart method
UserSchema.methods.addToCart = function (product) {
  const itemIndex = this.cart.items.findIndex((i) => {
    return i.productId.equals(product._id);
  });

  if (itemIndex !== -1) {
    //product already exists in cart
    this.cart.items[itemIndex].quantity += 1;
  } else {
    //product does not exist in cart

    this.cart.items.push({
      productId: product._id,
      quantity: 1,
    });
  }

  return this.save();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
