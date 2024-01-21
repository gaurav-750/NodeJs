// const products = [];

const path = require("path");
const fs = require("fs");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const p = path.join(__dirname, "../", "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }

      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString(); //assigning an id to the product
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log("err", err);
        });
      }
    });
  }

  static fetchAllProducts(cb) {
    //getting the data from the file
    const p = path.join(__dirname, "../", "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      if (err) {
        //no file exists
        return cb([]);
      }

      const products = JSON.parse(fileContent);
      console.log("products in fetch =>", products);

      cb(products);
    });
  }

  static findProductById(id, cb) {
    const p = path.join(__dirname, "../", "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      if (err) {
        //no file exists
        return cb([]);
      }

      const products = JSON.parse(fileContent);
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
