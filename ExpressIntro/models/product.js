const Cart = require("./cart");

const db = require("../utils/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static fetchAllProducts() {
    return db.execute("SELECT * FROM products");
  }

  static findProductById(id) {
    return db.execute("SELECT * FROM products where id=?", [id]);
  }

  static deleteById(id) {}
};
