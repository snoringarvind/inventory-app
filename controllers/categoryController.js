const async = require("async");
const { body, validationResult } = require("express-validator");
const Category = require("../models/Category");
const Item = require("../models/Item");
const fs = require("fs");
const path = require("path");

exports.index = (req, res, next) => {
  async.parallel(
    {
      countCategory: (callback) => Category.countDocuments({}, callback),
      countItem: (callback) => Item.countDocuments({}, callback),
    },
    (err, results) => {
      if (err) return next(err);
      else {
        res.render("index", {
          title: "Home Page",
          countCategory: results.countCategory,
          countItem: results.countItem,
        });
      }
    }
  );
};

exports.category_list = (req, res, next) => {
  Category.find({}).exec((err, result) => {
    if (err) return next(err);
    else {
      // console.log(result);
      res.render("category_list", {
        title: "Category List",
        categories: result,
      });
    }
  });
};

exports.category_detail = async (req, res, next) => {
  // try {
  //   const x = await Item.findById("5ff1dbd7f76fef8cdd1b8b07");
  //   console.log(x);
  // } catch (err) {
  //   console.log(err);
  // }

  Category.findById(req.params.id)
    .populate("item")
    .exec((err, result) => {
      if (err) return next(err);
      else {
        // console.log(result);
        res.render("category_detail", {
          title: "category_detail",
          category: result,
        });
      }
    });
};

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
  body("categoryName", "category name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categoryDescription", "category description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categoryImage").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log("file=", req.file);
    console.log("path=", path.join(__dirname, "../"));
    let data;
    try {
      data = await fs.readFileSync(path.join(__dirname, "../") + req.file.path);
      console.log("data=", data);
    } catch (err) {
      console.log(err);
      return next(err);
    }

    const category = new Category({
      categoryName: req.body.categoryName,
      categoryDescription: req.body.categoryDescription,
      categoryImage: { data: data, contentType: "image/jpg" },
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Category Create",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ categoryName: req.body.categoryName }).exec(
        (err, result) => {
          if (err) return next(err);
          if (result) {
            console.log("already exits");
            res.redirect(result.url);
            return;
          } else {
            // console.log(category);
            category.save((err) => {
              if (err) {
                console.log("in category get");
                return next(err);
              } else {
                res.redirect(category.url);
              }
            });
          }
        }
      );
    }
  },
];

exports.category_update_get = (req, res) => {
  Category.findById(req.params.id).exec((err, result) => {
    if (err) return next(err);
    else {
      res.render("category_form", {
        title: "Update Category",
        category: result,
      });
    }
  });
};

exports.category_update_post = [
  body("categoryName", "Category name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categoryDescription", "Category description cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("categoryImage").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    let items;

    try {
      items = await Category.findById(req.params.id, "item");
    } catch (err) {
      if (err) return next(err);
    }

    let data;
    console.log("update file", req.file);
    try {
      data = await fs.readFileSync(path.join(__dirname, "../") + req.file.path);
      console.log("update data=", data);
    } catch (err) {
      console.log(err);
      return next(err);
    }

    // console.log(items.item);
    const category = new Category({
      categoryName: req.body.categoryName,
      categoryDescription: req.body.categoryDescription,
      categoryImage: { data: data, contentType: "image/jpg" },
      item: items.item,
      _id: req.params.id,
    });

    // console.log("category=", category);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Category.findOne({
      //   categoryName: category.categoryName,
      // }).exec((err, result) => {
      //   if (err) return next(err);
      //   if (result) {
      //     console.log("already exits");
      //     // console.log("alreay=", result);
      //     res.redirect(category.url);
      //     return;
      //   } else {
      // console.log("hahahhahhahahahha");
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        (err, thecategory) => {
          if (err) return next(err);
          else {
            res.redirect(thecategory.url);
          }
        }
      );
    }
    // });
    // }
  },
];

exports.category_delete_get = (req, res) => {
  Category.findById(req.params.id)
    .populate("item")
    .exec((err, result) => {
      if (err) return next(err);
      else {
        res.render("category_delete", {
          title: "Category Delete",
          category: result,
        });
      }
    });
};

exports.category_delete_post = async (req, res, next) => {
  let category;
  try {
    category = await Category.findById(req.params.id);
  } catch (err) {
    if (err) return next(err);
  }

  try {
    for (let i = 0; i < category.item.length; i++) {
      console.log(category.item[i]);
      const item_removed = await Item.findByIdAndRemove(category.item[i]);
      console.log("item_removed", item_removed);
    }
  } catch (err) {
    if (err) return next(err);
  }

  try {
    const category_removed = await Category.findByIdAndRemove(req.params.id);
    console.log("category_removed", category_removed);
    res.redirect("/catalog/categories");
  } catch (err) {
    if (err) return next(err);
  }
};
