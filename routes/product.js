const express = require("express");
const router = express.Router();
const productModal = require("../models/product");
/* GET users listing. */
router.get("/", async (req, res)=> {
  const a = {
    title: 'Magical Kashmir Tour Package For Family',
    description: 'The dates, Hotels and itinerary can be customised according to your preferences. Feel free to reach out to us and let us know if you wish for the same.'
  };
  a.url = a.title.replace(/[ ]/g, '-').toLowerCase();
  const r = new productModal(a);
  await r.save();
  res.send("respond with a resource");
});

router.get("/all-packages", async (req, res)=> {
  try {
    const r = await productModal.find().limit(10);
    res.send({ data: { list: r }});
  } catch(e) {
    res.send({ message: e.toString() });
  }
});

module.exports = router;
