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
// let projectDetails = new Schema({
//   title: { type: String, default: "" },
//   desc: { type: String, default: "" },
//   externallink: { type: String, default: "" },
// });

let ProductSchema = new Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true },
    url: { type: String, required: true },
    modifiedAt: { type: Number, default: ()=> moment().utc().valueOf() },
    createdAt: { type: Number, default: ()=> moment().utc().valueOf() },
  }, { minimize: false });

ProductSchema.virtual('fullImageURL').get(function() {
  // You can customize the prefix here
  const prefix = "http://localhost:4000";
  return prefix + this.imageURL;
});
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