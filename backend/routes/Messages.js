const router = require("express").Router();
let Messages = require("../models/messages.model");
let User = require("../models/user.model");

//add Messages
router.post("/add_message", async (req, res) => {
  const { channelId, text, user } = req.body;

  if (text.length < 1 || !channelId || !user?.userId) {
    return res.status(400).json({
      success: false,
      message: "message text or channelId or userId missing",
    });
  }

  const message = await Messages.create({
    text,
    channelId,
    userId: user?.userId,
  });

  if (!message.id) return res.json({ success: false, message });

  const messageWithUser = await Messages.findOne({
    where: { id: message.id },
    include: [
      { model: User, as: "user", attributes: { exclude: ["password"] } },
    ],
  });

  res.json({ message: messageWithUser, success: true });
});

//read messages from channel
router.get("/get_messages", async (req, res) => {
  const { channelId } = req.query;
  if (!channelId)
    return res
      .status(400)
      .json({ success: false, message: "channelId is required." });

  let messages = await Messages.findAll({
    where: { channelId },
    include: [
      { model: User, as: "user", attributes: { exclude: ["password"] } },
    ],
  });
  if (!messages)
    return res
      .status(404)
      .json({ success: false, message: "messages not found." });
  res.status(200).json(messages);
});

module.exports = router;
