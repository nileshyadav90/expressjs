const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let ImageSchema = new Schema({
    imageURL: { type: String, required: true, max: 100 },
    size: { type: Number, required: true },
    createdAt: { type: Number, default: ()=> moment().utc().valueOf() },
  }, { minimize: false });

ImageSchema.virtual('fullImageURL').get(function() {
  // You can customize the prefix here
  const prefix = "http://localhost:4000";
  return prefix + this.imageURL;
});

module.exports = mongoose.model("Product", ProductSchema);