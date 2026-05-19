import express from "express";

import User from "../models/User.js";

const router = express.Router();


// SEARCH USERS
router.get("/", async (req, res) => {

  try {

    const keyword = req.query.search
      ? {
          username: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};

    const users = await User.find(keyword)
      .select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

export default router;