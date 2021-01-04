const express = require("express");
const router = express.Router();
const categorycontroller = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const multer = require("multer");

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "categoryStorage"),
  filename: (req, file, cb) => cb(null, file.fieldname + "-" + Date.now()),
});

const upload = multer({ storage: categoryStorage });
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
  upload.single("categoryImage"),
  categorycontroller.category_create_post
);
//categrory update get
router.get("/category/:id/update", categorycontroller.category_update_get);
//category update post
router.post(
  "/category/:id/update",
  upload.single("categoryImage"),
  categorycontroller.category_update_post
);
//category delete get
router.get("/category/:id/delete", categorycontroller.category_delete_get);
//categpry delete get
router.post("/category/:id/delete", categorycontroller.category_delete_post);
//category detail
router.get("/category/:id", categorycontroller.category_detail);

//*set routes for item
router.get("/items", itemController.item_list);
router.get("/item/create", itemController.item_create_get);
router.post("/item/create", itemController.item_create_post);
router.get("/item/:id/update", itemController.item_update_get);
router.post("/item/:id/update", itemController.item_update_post);
router.get("/item/:id/delete", itemController.item_delete_get);
router.post("/item/:id/delete", itemController.item_delete_post);
router.get("/item/:id", itemController.item_detail);

module.exports = router;
