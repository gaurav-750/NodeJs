// const products = [];

const path = require("path");
const fs = require("fs");

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    const p = path.join(__dirname, "../", "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }

      products.push(this);
      console.log("products =>", products);

      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log("err", err);
      });
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
};
