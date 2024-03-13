const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().populate("category").exec();
  res.render("item_list", {
    title: "Item List",
    list_items: allItems,
  });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate("category")
    .exec();
  if (!item) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item Detail",
    item: item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().exec();
  res.render("item_form", { title: "Create Item", categories: categories });
});

exports.item_create_post = [
  body("name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty").trim().escape(),
  body("price", "Invalid price").isNumeric(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Create Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (!item) {
    res.redirect("/catalog/items");
    return;
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.body.id).exec();

  if (!item) {
    res.redirect("/catalog/items");
    return;
  } else {
    await Item.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/items");
  }
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate("category")
    .exec();
  if (!item) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  const categories = await Category.find().exec();

  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: categories,
  });
});

exports.item_update_post = [
  body("name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty").trim().escape(),
  body("price", "Invalid price").isNumeric(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();
      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    }
  }),
];