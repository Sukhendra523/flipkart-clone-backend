const slugify = require("slugify");
const Product = require("../models/product");

exports.createProduct = (req, res) => {
  const { name, price, description, quantity, categoryId } = req.body;

  let images = [];
  if (req.files.length > 0) {
    images = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    quantity,
    categoryId,
    createdBy: req.user._id,
    images,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product: product });
    }
  });
};
