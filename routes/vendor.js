var express = require("express");
const vendor = require("../models/vendor");
var router = express.Router();

router.post("/signup", async function (req, res, next) {
  try {
    const input = req.body;
    const a = {
      originalName: input.originalName,
      displayName: input.displayName,
      email: input.email,
      mobile: input.mobile,
      password: input.password
    };
    console.log('a-->', a);
    const r = new vendor(a);
    await r.save();
    res.send({ data: { vendor: r }});
  } catch(e) {
    console.error('e--->', e);
    res.status(400).send({ message: e.toString()});
  }
});

router.post("/delete", async function (req, res, next) {
  try {
    const input = req.body;
    await vendor.deleteOne({ email: input.email });
    res.send({ message: 'Deleted'});
  } catch(e) {
    res.status(400).send({ message: e.toString()});
  }
});

module.exports = router;
