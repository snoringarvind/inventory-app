const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = Schema({
  categoryName: { type: String, required: true },
  categoryDescription: { type: String, required: true },
  categoryImage: { data: Buffer, contentType: String },
  item: [{ type: Schema.Types.ObjectId, ref: "Item", required: true }],
});

CategorySchema.virtual("url").get(function () {
  return "/catalog/category/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
