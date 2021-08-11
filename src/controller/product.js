const slugify = require("slugify");
const Product = require("../models/product");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  const { name, price, description, quantity, category } = req.body;

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
    category,
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

const productsByPrice = (products) => {
  const productsByPrice = [];
  for (let price = 5000, i = 0; price <= 30000; price += 5000, i += 5000) {
    productsByPrice.push({
      price: price,
      products: products.filter(
        (product) => product.price > i && product.price <= price
      ),
    });
  }
  return productsByPrice;
};

exports.getAllProductsBySlug = async (req, res) => {
  try {
    const categoryId = await Category.find({ slug: req.params.slug }, "_id");
    if (categoryId) {
      const products = await Product.find({ category: categoryId });
      if (products) {
        res.status(200).json({
          products: products,
          productsByPrice: productsByPrice(products),
        });
      } else {
        res.status(400).json({ message: "No Products found in this Category" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateProducts = (req, res) => {
  Product.updateMany(
    { category: "60b07f927c9fc20f1ce16307" },
    { $set: { category: "60b07fe67c9fc20f1ce16309" } },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(data);
    }
  );
};
