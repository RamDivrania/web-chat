const router  = require('express').Router();
let Workspaces = require("../models/workspaces.model");

router.get("/", async (req, res) => {
  let workspaces = await Workspaces.findAll();
  if (!workspaces)
    return res
      .status(404)
      .json({ success: false, message: "workspaces not found." });
  res.status(200).json(workspaces);
});

module.exports = router;