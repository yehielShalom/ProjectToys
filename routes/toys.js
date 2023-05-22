const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const perPage = req.query.perPage || 4;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    const search = req.query.s;

    let filterFind = {};
    if (search) {
      const seachExp = new RegExp(search, "i");
      filterFind = { name: seachExp };
    }

    const data = await ToyModel.find(filterFind)
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// router.get("/cat", async (req, res) => {
//   const data = req.query.c;
//   const searchExp = new RegExp(data, "i");
//   const filterData = await ToyModel.find({ category: searchExp });
//   res.json(filterData);
// });

router.get("/cat", async (req, res) => {
  const data = req.query.c;
  const searchExp = new RegExp(data, "i");
  const filterData = await ToyModel.find({ category: searchExp });
  res.json(filterData);
});

router.get("/price", async (req, res) => {
  const min = req.query.min || 0;
  const max = req.query.max || Infinity;
  try {
    const data = await ToyModel.find({ price: { $gte: min, $lte: max } } );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/count", async (req, res) => {
  try {
    const perPage = req.query.perPage || 5;
    const count = await ToyModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/", auth, async (req, res) => {
  const validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/:id", auth, async (req, res) => {
  const validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await ToyModel.updateOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.deleteOne({
      _id: id,
      user_id: req.tokenData._id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
