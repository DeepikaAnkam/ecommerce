var express = require("express");
var router = express.Router();
var gettoken = require("../helpers/gettoken");
var db = require("../database/conn");
var ash = require("express-async-handler");

// verify user credentials
async function verifyUser(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql =
    "SELECT username, isadmin  FROM user WHERE username = ? AND password = ?";
  var params = [username, password];
  const [result] = await db.query(sql, params);
  if (result.length > 0) {
    req.username = result[0].username;
    req.isadmin = result[0].isadmin;
  } else {
    res.status(400).json({ error: "Invalid username or password" });
  }
}

// login middleware
router.post(
  "/",
  ash(async function (req, res) {
    await verifyUser(req, res);
    var token = gettoken(req.username, req.isadmin);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ username: req.username, isadmin: req.isadmin });
  })
);

module.exports = router;
