const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let VendorSchema = new Schema(
  {
    displayName: { type: String, required: true, max: 100 },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    password: {type: String, required: true },
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

module.exports = mongoose.model("Vendor", VendorSchema);
