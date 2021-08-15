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



exports.updateCategories =async (req,res)=>{
  const {_id,name,parentId,type} = req.body

  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({ updatedCategory });
  }

}

// My 1st approch
exports.deleteCategories = async (req, res) => {
  const { ids } = req.body
  const deletedCategories = await Category.deleteMany({ _id: ids });
  console.log("deletedCategories.deletedCount",deletedCategories.deletedCount )
  console.log("deletedCategories.deletedCount === ids.length",deletedCategories.deletedCount === ids.length)
  if (deletedCategories.deletedCount === ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
}


// exports.deleteCategories = async (req, res) => {
//   const { ids } = req.body.payload;
//   const deletedCategories = [];
//   for (let i = 0; i < ids.length; i++) {
//     const deleteCategory = await Category.findOneAndDelete({
//       _id: ids[i]._id,
//       createdBy: req.user._id,
//     });
//     deletedCategories.push(deleteCategory);
//   }

//   if (deletedCategories.length == ids.length) {
//     res.status(201).json({ message: "Categories removed" });
//   } else {
//     res.status(400).json({ message: "Something went wrong" });
//   }
// };



