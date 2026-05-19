import express from "express";

import Message from "../models/Message.js";

const router = express.Router();


// RECENT CHATS
router.get("/recent/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    const messages = await Message.find({

      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],

    })
      .populate("senderId", "username email")
      .populate("receiverId", "username email")
      .sort({ createdAt: -1 });


    const recentUsers = [];

    messages.forEach((msg) => {

      const otherUser =
        msg.senderId._id.toString() === userId
          ? msg.receiverId
          : msg.senderId;

      const exists = recentUsers.find(
        (u) =>
          u._id.toString() ===
          otherUser._id.toString()
      );

      if (!exists) {
        recentUsers.push(otherUser);
      }

    });

    res.json(recentUsers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


// GET CHAT MESSAGES
router.get("/:user1/:user2", async (req, res) => {

  try {

    const messages = await Message.find({

      $or: [

        {
          senderId: req.params.user1,
          receiverId: req.params.user2,
        },

        {
          senderId: req.params.user2,
          receiverId: req.params.user1,
        },

      ],

    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

export default router;