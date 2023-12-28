const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

// let educationDetails = new Schema({
//   degree: { type: String },
//   joinyear: { type: Number },
//   endyear: { type: Number, default: 0 },
//   college: { type: String },
// });
// let certificateDetails = new Schema({
//   certificateCourse: { type: String, default: "" },
//   instituteName: { type: String, default: "" },
//   startFrom: { type: String, default: "" },
//   endTo: { type: String, default: "" },
//   note: { type: String, default: "" },
// });
let ImageSchema = new Schema({
  imageURL: { type: String, required: true, max: 100 },
  size: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Number, default: ()=> moment().utc().valueOf() },
}, { minimize: false });

let ProductSchema = new Schema(
  {
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true },
    url: { type: String, required: true },
    images: { type: [ImageSchema], default: [] },
    modifiedAt: { type: Number, default: () => moment().utc().valueOf() },
    createdAt: { type: Number, default: () => moment().utc().valueOf() },
  },
  { minimize: false }
);

// UserSchema.path("avatar").get(function (v) {
//   return Config.url + Config._avatarURL + (v ? v : "default.png");
// });

// UserSchema.set("toJSON", { getters: true, virtuals: false });

// UserSchema.index({
//   firstname: "text",
//   lastname: "text",
//   about: "text",
//   projectDetails: "text",
//   skills: "text",
// });

module.exports = mongoose.model("Product", ProductSchema);
