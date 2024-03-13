const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    list_categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const category_items = await Item.find({ category: req.params.id }).exec();

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_items: category_items,
  });
});

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (!category) {
    res.redirect("/catalog/categories");
    return;
  }

  const category_items = await Item.find({ category: req.params.id }).exec();

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: category_items,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.id).exec();

  if (!category) {
    res.redirect("/catalog/categories");
    return;
  } else {
    await Category.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", { title: "Update Category", category: category });
});

exports.category_update_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];
