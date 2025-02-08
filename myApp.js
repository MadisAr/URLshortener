require("dotenv").config();
const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const linkSchema = require("./models/link");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB...");
  })
  .catch((err) => console.log(err));

const link = mongoose.model("link", linkSchema);

const saveLink = async (url) => {
  const collection = mongoose.connection.collection("urlsDB");

  const sameUrl = await link.findOne({
    link: url,
  });
  // if id already exists return the existing one
  if (sameUrl) {
    console.log("link exists");
    return sameUrl.id;
  }
  // increment id to associate an unique id with the link
  const count = await collection.findOneAndUpdate(
    { name: "id" },
    { $inc: { id: 1 } },
    { new: true }
  );

  const urlId = count.id;
  const newLink = new link({
    link: url,
    id: urlId,
  });

  await newLink.save();
  console.log("new link saved");
  return urlId;
};

router.post("/api/shorturl", function (req, res) {
  let url;
  try {
    url = new URL(req.body.url);
  } catch (err) {
    res.json({
      result: "bad url",
      error: true,
    });
    return;
  }
  dns.lookup(url.hostname, async (err, address, family) => {
    if (err) {
      res.json({
        result: "bad url",
        error: true,
      });
      return;
    } else {
      const id = await saveLink(url);
      res.json({
        result: id,
        error: false,
      });
    }
  });
});

router.get("/link/:linkId", async function (req, res) {
  let id = parseInt(req.params.linkId);
  if (isNaN(id)) {
    res.send("error: bad id");
  } else {
    const url = await link.findOne({
      id: id,
    });
    if (!url) {
      res.send("error: bad id");
    } else {
      res.redirect(301, url.link);
    }
  }
});

module.exports = router;
