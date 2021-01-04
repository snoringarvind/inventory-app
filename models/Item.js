const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = Schema({
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemPrice: { type: String, required: true },
  itemStock: { type: String, required: true },
  itemImage: [{ data: Buffer, contentType: String }],
});

ItemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
