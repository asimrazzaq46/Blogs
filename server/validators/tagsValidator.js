const { check } = require("express-validator");

exports.tagsCreateValidator = [
  check("name").not().isEmpty().withMessage("Tag name is required!"),
];
