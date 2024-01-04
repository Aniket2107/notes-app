const Note = require("../models/Notes");

exports.addNote = async (req, res) => {
  try {
    const { title, content, keywords } = req.body;

    const newNote = new Note({
      userId: req.userId,
      title,
      content,
      keywords,
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.userId;

    const allNotes = await Note.find({
      $or: [{ userId }, { sharedWith: userId }],
    })
      .populate("userId", "fullName email")
      .populate("sharedWith", "fullName email");

    res.json({ notes: allNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId }).populate(
      "userId",
      "fullName email"
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.updateOne({ _id: noteId, userId }, { $set: req.body });

    const updatedNote = await Note.findOne({ _id: noteId, userId });

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.shareWithUser = async (req, res) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    const sharedUserId = req.body.sharedUserId;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.sharedWith.includes(sharedUserId)) {
      return res
        .status(400)
        .json({ message: "Note is already shared with the user" });
    }

    note.sharedWith.push(sharedUserId);

    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchByQuery = async (req, res) => {
  try {
    const userId = req.userId;
    const query = req.query.q;

    if (!query) {
      return res
        .status(400)
        .json({ message: "Missing search query parameter (q)" });
    }

    const userNotes = await Note.find({
      userId: req.userId,
      keywords: query,
    }).populate("userId", "fullName email");

    const sharedNotes = await Note.find({
      sharedWith: userId,
      keywords: query,
    }).populate("userId", "fullName email");

    const searchResults = [...userNotes, ...sharedNotes];

    // The below searches in title and content if we index them
    // const userNotes = await Note.find({
    //   userId,
    //   $text: { $search: query },
    // }).populate("userId", "fullName email");

    // const sharedNotes = await Note.find({
    //   sharedWith: userId,
    //   $text: { $search: query },
    // }).populate("userId", "fullName email");

    // mongoose doesnt support partial-search so if needed we can use the below but this is costly operation since we match each doc with the regex.
    // { userId, title: { $regex: query, $options: 'i' } },
    // { sharedWith: userId, title: { $regex: query, $options: 'i' } },

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
