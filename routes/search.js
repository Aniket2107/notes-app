const router = require("express").Router();

const noteController = require("../controllers/notes");
const { auth } = require("../helpers/auth");

router.get("/", [auth], noteController.searchByQuery);

module.exports = router;
