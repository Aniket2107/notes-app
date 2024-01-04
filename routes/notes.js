const router = require("express").Router();

const noteController = require("../controllers/notes");
const { auth } = require("../helpers/auth");
const validation = require("../helpers/validate");

router.get("/", [auth], noteController.getAllNotes);

router.get("/:id", [auth], noteController.getNoteById);

router.post(
  "/",
  [auth, validation.postNoteValidationRules, validation.validate],
  noteController.addNote
);

router.put("/:id", [auth], noteController.updateNote);

router.delete("/:id", [auth], noteController.deleteNote);

router.post("/:id/share", [auth], noteController.shareWithUser);

module.exports = router;
