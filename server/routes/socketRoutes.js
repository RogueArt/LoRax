const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/socketing", (req, res) => {
  res.status(200).send("socket go brr");
});

module.exports = router;
