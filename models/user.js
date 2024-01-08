const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let UserSchema = new Schema(
  {
    firstname: { type: String, required: true, max: 100 },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    agoraResponse: { type: {} },
    salt: {type: String, required: true },
    mobile: { type: String, unique: true, index: true, select: false, sparse: true },
    modifiedAt: { type: Number, default: () => moment().utc().valueOf() },
    createdAt: { type: Number, default: () => moment().utc().valueOf() },
  }
);

module.exports = mongoose.model("User", UserSchema);
