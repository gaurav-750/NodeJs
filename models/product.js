const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },

  //Relations
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //model which we want to relate to
    required: true,
  },
});

//* creating a Product 'model'
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;

// const getDb = require("../utils/database").getDb;
// const { ObjectId } = require("mongodb");

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id;
//     this.userId = userId;
//   }

//   save() {
//     let db = getDb();
//     // console.log("type:", typeof this._id);

//     if (this._id) {
//       //update the product
//       db = db.collection("products").updateOne(
//         {
//           _id: this._id,
//         },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       //create a new product
//       db = db.collection("products").insertOne(this);
//     }

//     return db
//       .then((result) => {
//         console.log("result", result);
//       })
//       .catch((err) => {
//         console.log("err in save", err);
//       });
//   }

//   static fetchAllProducts() {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         // console.log("products", products);
//         return products;
//       })
//       .catch((err) => {
//         console.log("err in fetchAllProducts", err);
//       });
//   }

//   static fetchProductDetail(prodId) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => {
//         console.log("err in fetchProductDetail", err);
//       });
//   }

//   static deleteProduct(prodId) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(prodId) })
//       .then((result) => {
//         console.log("result", result);
//         console.log("Product Deleted");
//       })
//       .catch((err) => {
//         console.log("err in deleteProduct", err);
//       });
//   }
// }

// module.exports = Product;
