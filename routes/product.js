const express = require("express");
const router = express.Router();
const productModal = require("../models/product");
const itinerary = require("../models/itinerary");
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
    let newResults = [];
    for(let i = 0; i < r.length; i++) {
      let _r = r[i].toJSON();
      _r["minPricePerPerson"] = 'INR ' + _r["minPricePerPerson"];
      newResults.push(_r);
    }
    res.send({ data: { list: newResults }});
  } catch(e) {
    res.send({ message: e.toString() });
  }
});

// router.get("/test", async (req, res)=> {
//   try {
//     const a = {
//       title: 'Magical Kashmir Tour Package For Family',
//       description: 'The dates, Hotels and itinerary can be customised according to your preferences. Feel free to reach out to us and let us know if you wish for the same.'
//     };
//     const r = new itinerary(a);
//     await r.save();
//     res.send({ data: { list: r }});
//   } catch(e) {
//     res.send({ message: e.toString() });
//   }
// });

router.post("/single", async (req, res)=> {
  try {
    const input = req.body;
    // console.log('input.url', input);
    let r = await productModal.findOne({ url: input.slug });
    if(r == null) throw 'No data found';
    r = r.toJSON();
    let itineraries = await itinerary.find({ _id: { $in: r.itineraries.map((v)=> v.id)}});
    let itiCopy = r.itineraries;
    for(let i = 0; i < itiCopy.length; i++) {
      // console.log(itiCopy[i]);
      for(let j = 0; j < itineraries.length; j++) {
        let itiData = itineraries[j].toJSON();
        if(itiCopy[i]["id"].toString() == itiData["_id"].toString()) {
          itiCopy[i] = {...itiCopy[i], ...itiData}
          break;
        }
      }
    }
    let packagesCopy = r.packages;
    for(let i = 0; i < packagesCopy.length; i++) {
      packagesCopy[i]["price"] = 'INR ' + packagesCopy[i]["price"];
    }
    r.packages = packagesCopy;
    
    r.itineraries = itiCopy;
    // console.log(itiCopy, itineraries);
    res.send({ data: { product: r }});
  } catch(e) {
    res.send({ message: e.toString() });
  }
});

module.exports = router;
