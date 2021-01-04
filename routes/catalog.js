const express = require("express");
const router = express.Router();
const categorycontroller = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const multer = require("multer");

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "categoryStorage"),
  filename: (req, file, cb) => cb(null, file.fieldname + "-" + Date.now()),
});

const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "itemStorage"),
  filename: (req, file, cb) => cb(null, file.fieldname + "-" + Date.now()),
});

const upload_category = multer({ storage: categoryStorage });
const upload_item = multer({ storage: itemStorage });
//home page
router.get("/", categorycontroller.index);

//*set routes for category
//category list
router.get("/categories", categorycontroller.category_list);
//category create get
router.get("/category/create", categorycontroller.category_create_get);
//category create post
router.post(
  "/category/create",
  upload_category.single("categoryImage"),
  categorycontroller.category_create_post
);
//categrory update get
router.get("/category/:id/update", categorycontroller.category_update_get);
//category update post
router.post(
  "/category/:id/update",
  upload_category.single("categoryImage"),
  categorycontroller.category_update_post
);
//category delete get
router.get("/category/:id/delete", categorycontroller.category_delete_get);
//categpry delete get
router.post("/category/:id/delete", categorycontroller.category_delete_post);
//category detail
router.get("/category/:id", categorycontroller.category_detail);

//*set routes for item
//item list
router.get("/items", itemController.item_list);
//item create get
router.get("/item/create", itemController.item_create_get);
//item create post
router.post(
  "/item/create",
  upload_item.single("itemImage"),
  itemController.item_create_post
);
//item update get
router.get("/item/:id/update", itemController.item_update_get);
//item update post
router.post(
  "/item/:id/update",
  upload_item.single("itemImage"),
  itemController.item_update_post
);
//item delete get
router.get("/item/:id/delete", itemController.item_delete_get);
//item delete post
router.post("/item/:id/delete", itemController.item_delete_post);
//item detail
router.get("/item/:id", itemController.item_detail);

module.exports = router;
