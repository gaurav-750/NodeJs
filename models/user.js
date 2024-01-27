const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      //we hav the product in the cart already, so update the quantity
      newQuantity = this.cart.items[cartProductIndex].quantity += 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();

    console.log("updatedCart:", updatedCart);
    // console.log("this._id:", this._id, typeof this._id);

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        {
          $set: {
            cart: updatedCart,
          },
        }
      )
      .then((result) => {
        console.log("result:", result);
      })
      .catch((err) => {
        console.log("err in addToCart:", err);
      });
  }

  getCart() {
    const db = getDb();

    const productsIds = this.cart.items.map((i) => {
      return i.productId;
    });

    return db
      .collection("products")
      .find({
        _id: {
          $in: productsIds,
        },
      })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((i) => {
      return i.productId.toString() !== productId.toString();
    });

    const db = getDb();

    return db.collection("users").updateOne(
      {
        _id: new ObjectId(this._id),
      },
      {
        $set: {
          cart: {
            items: updatedCartItems,
          },
        },
      }
    );
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };

        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        // this.cart = { items: [] }; //empty the cart, as order is placed

        return db.collection("users").updateOne(
          { _id: new ObjectId(this._id) },
          {
            $set: {
              cart: { items: [] },
            },
          }
        );
      });
  }

  getOrder() {
    const db = getDb();
    return db
      .collection("orders")
      .find({
        "user._id": new ObjectId(this._id),
      })
      .toArray();
  }
}

module.exports = User;
