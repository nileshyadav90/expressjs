const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

let itinerarySchema = new Schema(
  {
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true },
    modifiedAt: { type: Number, default: () => moment().utc().valueOf() },
    createdAt: { type: Number, default: () => moment().utc().valueOf() },
  },
  { minimize: false }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
