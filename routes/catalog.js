const express = require("express");
const router = express.Router();
const categorycontroller = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

//home page
router.get("/", categorycontroller.index);

//set routes for category
router.get("/categories", categorycontroller.category_list);
router.get("/category/create", categorycontroller.category_create_get);
router.post("/category/create", categorycontroller.category_create_post);
router.get("/category/:id/update", categorycontroller.category_update_get);
router.post("/category/:id/update", categorycontroller.category_update_post);
router.get("/category/:id/delete", categorycontroller.category_delete_get);
router.post("/category/:id/delete", categorycontroller.category_delete_post);
router.get("/category/:id", categorycontroller.category_detail);

//set routes for item
router.get("/items", itemController.item_list);
router.get("/item/create", itemController.item_create_get);
router.post("/item/create", itemController.item_create_post);
router.get("/item/:id/update", itemController.item_update_get);
router.post("/item/:id/update", itemController.item_update_post);
router.get("/item/:id/delete", itemController.item_delete_get);
router.post("/item/:id/delete", itemController.item_delete_post);
router.get("/item/:id", itemController.item_detail);

module.exports = router;
