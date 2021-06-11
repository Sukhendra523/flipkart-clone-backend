const Category = require("../models/category");
const slugify = require("slugify");

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
      slug: category.slug,
      children: createCategories(categories, category._id),
    });
  }
  return categoryList;
};

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.file) {
    console.log(req.file);
    categoryObj.image = process.env.API + "/public/" + req.file.filename;
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const category = new Category(categoryObj);
  category.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      res.status(201).json({ category: category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};
