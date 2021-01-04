const Item = require("../models/Item");
const Category = require("../models/Category");
const { body, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const { Error } = require("mongoose");

exports.item_list = (req, res) => {
  Item.find({}).exec((err, result) => {
    if (err) return next(err);
    else {
      res.render("item_list", { title: "Item List", items: result });
      return;
    }
  });
};

exports.item_detail = (req, res) => {
  Item.findById(req.params.id).exec((err, result) => {
    if (err) return next(err);
    else {
      res.render("item_detail", { title: "item_detail", item: result });
      return;
    }
  });
};

exports.item_create_get = (req, res, next) => {
  Category.find({}, "categoryName").exec((err, result) => {
    if (err) return next(err);
    else {
      res.render("item_form", { title: "Create Item", categories: result });
      return;
    }
  });
};

exports.item_create_post = [
  body("itemName", "item Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemDescription", "item Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemPrice", "item Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemStock", "item Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemImage").escape(),

  async (req, res, next) => {
    // console.log("hahahah");
    const errors = validationResult(req);

    let data;
    // console.log("item create post=", req.file);
    try {
      data = await fs.readFileSync(path.join(__dirname, "../") + req.file.path);
      // console.log("item create post=", data);
    } catch (err) {
      // console.log(data);
      return next(err);
    }

    const item = new Item({
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      itemStock: req.body.itemStock,
      itemImage: { data: data, contentType: "image/jpg" },
    });

    let categories;
    try {
      categories = await Category.find({}, "categoryName");
      // categories = [categories];
    } catch (err) {
      return next(err);
    }

    // console.log("req.body.category=", req.body.category);
    // console.log("categories", categories);
    if (!errors.isEmpty()) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i]._id.toString() == req.body.category.toString()) {
          // console.log("categories[i]=", categories[i]);
          categories[i].selected = true;
        }
      }
      res.render("item_form", {
        title: "Create Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    }
    Item.findOne({ itemName: item.itemName }, (err, result) => {
      if (err) return next(err);
      if (result) {
        // console.log("already exists");
        res.redirect(result.url);
        return;
      }
    });
    // console.log("item=", item);
    let category;
    try {
      category = await Category.findById(req.body.category, "item");
      //adding item to category
      category.item.push(item._id);
      // console.log("category", category.item);
    } catch (err) {
      return next(err);
    }
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.body.category,
        { item: category.item }
      );
      // console.log("updateCategory=", updatedCategory);
    } catch (err) {
      return next(err);
    }
    try {
      const saveItem = await item.save();
      // console.log("saveitem=", saveItem);
      res.redirect(item.url);
      return;
    } catch (err) {
      return next(err);
    }
  },
];

exports.item_update_get = async (req, res, next) => {
  let category;
  let categories;
  let item;
  try {
    category = await Category.find({ item: req.params.id }, "categoryName");
  } catch (err) {
    return next(err);
  }
  try {
    categories = await Category.find({}, "categoryName");
  } catch (err) {
    return next(err);
  }
  try {
    item = await Item.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  // console.log(categories);
  // console.log(category);
  // console.log(item);

  for (let i = 0; i < categories.length; i++) {
    if (categories[i]._id.toString() == category[0]._id) {
      categories[i].selected = true;
    }
  }

  res.render("item_form", {
    title: "Update Item",
    categories: categories,
    item: item,
  });
  return;
};

exports.item_update_post = [
  body("itemName", "item Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemDescription", "item Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemPrice", "item Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemStock", "item Stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("itemImage").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    let data;
    let contentType;
    let itemImage;
    //using if and else cause maybe if you don't wish to update the image
    if (req.file != undefined) {
      try {
        data = await fs.readFileSync(
          path.join(__dirname, "../") + req.file.path
        );
        itemImage = { data: data, contentType: "image/jpg" };
      } catch (err) {
        // console.log(err);
        return next(err);
      }
    } else {
      try {
        data = await Item.findById(req.params.id, "itemImage");
        // console.log(data);
        // console.log("data update item post = ", data.itemImage.data);
        //*usinf if-else in case the image was not there in the first place
        if (data == undefined || data == false) {
          itemImage = false;
        } else {
          itemImage = { data: data.itemImage.data, contentType: "image/jpg" };
        }
      } catch (err) {
        // console.log(err);
        return next(err);
      }
    }

    const item = new Item({
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemPrice: req.body.itemPrice,
      itemStock: req.body.itemStock,
      itemImage: itemImage,
      _id: req.params.id,
    });

    let categories;
    try {
      categories = await Category.find({}, "categoryName");
      // categories = [categories];
    } catch (err) {
      return next(err);
    }

    // console.log("req.body.category=", req.body.category);
    // console.log("categories", categories);
    if (!errors.isEmpty()) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i]._id.toString() == req.body.category.toString()) {
          // console.log("categories[i]=", categories[i]);
          categories[i].selected = true;
        }
      }
      res.render("item_form", {
        title: "Create Item",
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    }

    //*commenting this out because maybe if you just want to update the image and the item name is not updated, it will return you back
    // try {
    //   const itemOne = await Item.findOne({ itemName: item.itemName });
    //   if (itemOne) {
    //     console.log("ALready exists item with same name");
    //     res.redirect(itemOne.url);
    //     return;
    //   }
    // } catch (err) {
    //   return next(err);
    // }

    // console.log("item=", item);
    let category;
    try {
      category = await Category.findById(req.body.category, "item");
      //adding item to category
      // console.log("category", category);
      // category.item.push(item._id);
      // x = [...category.item];
      // console.log("x=", x);
      // console.log("category", category.item);
    } catch (err) {
      return next(err);
    }
    try {
      const updateCategory = await Category.findByIdAndUpdate(
        req.body.category,
        { item: [...category.item] }
      );
      // console.log("updateCategory=", updateCategory);
    } catch (err) {
      return next(err);
    }
    try {
      // console.log("item=", item);
      const updateItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      // console.log("updateitem=", updateItem);
      res.redirect(item.url);
      return;
    } catch (err) {
      return next(err);
    }
  },
];

exports.item_delete_get = (req, res) => {
  Item.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    if (result == null) {
      // console.log("item not found");
      res.redirect("/catalog/items");
      return;
    } else {
      res.render("item_delete", { title: "Delete Item", item: result });
      return;
    }
  });
};

exports.item_delete_post = async (req, res, next) => {
  let item;
  let newarr = [];
  try {
    // items = await Category.find({}, "item");
    item = await Category.findOne({ item: req.params.id }, "item");
    // console.log("item.item", item.item);
    // console.log(items);
    for (let i = 0; i < item.item.length; i++) {
      if (item.item[i].toString() != req.params.id.toString()) {
        newarr.push(item.item[i]);
      }
    }
    // console.log("newarr", newarr);
  } catch (err) {
    return next(err);
  }

  try {
    const updateCategory = await Category.findOneAndUpdate(
      { item: req.params.id },
      { $set: { item: newarr } }
    );
    // console.log("update Category=", updateCategory);
  } catch (err) {
    return next(err);
  }

  try {
    const updateItem = await Item.findByIdAndRemove(req.params.id);
    // console.log("updateItem=", updateItem);
    res.redirect("/catalog/items");
    return;
  } catch (err) {
    return next(err);
  }
  // Category.findOneAndUpdate(
  //   { item: req.params.id },
  //   { $set: { item: false } },
  //   (err, doc) => {
  //     if (err) return next(err);
  //     console.log("only category removed=", doc);

  //     Item.findByIdAndRemove(req.params.id, (err, doc) => {
  //       if (err) return next(err);
  //       console.log("only item removed= ", doc);
  //       res.redirect("/catalog/items");
  //     });
  //   }
  // );
};
