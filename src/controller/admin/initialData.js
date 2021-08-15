const Category = require("../../models/category");
const Product = require("../../models/product");

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let filteredCategories;
  if (parentId == null) {
    filteredCategories = categories.filter(
      (category) => category.parentId == undefined
    );
  } else {
    filteredCategories = categories.filter(
      (category) => category.parentId == parentId
    );
  }

  for (let category of filteredCategories) {
    categoryList.push({
      _id: category._id,
      name: category.name,
      parentId:category.parentId,
      slug: category.slug,
      type:category.type,
      children: createCategories(categories, category._id),
    });
  }
  return categoryList;
};

exports.getInitialData = async (req, res) => {
  const categories = await Category.find({}).exec();
  const products = await Product.find(
    {},
    "_id name price quantity description images category"
  )
    .populate("category", "_id name")
    .exec();

  res.status(200).json({ categories: createCategories(categories), products });
};
