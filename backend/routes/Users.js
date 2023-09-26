const router  = require('express').Router();
let User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");

router.post("/authenticate", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.json({
      success: false,
      message: "Not a valid username or password.",
    });
  }
  let isAuthenticated = false;

  let user = await User.findOne({
    where: { username: username, password: password },
    attributes: { exclude: ["password"] },
  });
  if (!user)
    return res.status(404).json({
      authenticated: isAuthenticated,
      message: "User not found.",
    });

  isAuthenticated = true;
  return res.json({
    authenticated: isAuthenticated,
    user: {
      public_channels: user.public_channels,
      direct_channels: user.direct_channels,
      userId: user.id,
      fname: user.fname,
      lname: user.lname,
      username: user.username,
    },
  });
});

//SignUp
router.post("/signUp", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;
  if (!username || !password || !fname || !lname) {
    return res.json({
      success: false,
      message: "Not a valid username or password or fname or lname.",
    });
  }
  //check if username is unique
  const isUserExists = await User.findOne({ where: { username: username } });
  if (isUserExists) {
    return res.json({
      success: false,
      message: "The user with provided username already exists. ",
    });
  }
  const newUser = {
    username: username,
    password: password,
    fname: fname,
    lname: lname,
    public_channels: [
      {
        id: 0,
        name: "Public",
      },
    ],
    direct_channels: [],
  };
  let user = await User.create(newUser);
  if (user.id)
    return res.json({
      authenticated: true,
      user: {
        public_channels: user.public_channels,
        direct_channels: user.direct_channels,
        userId: user.id,
        fname: user.fname,
        lname: user.lname,
        username: user.username,
      },
    });
  return res.json({
    success: false,
    authenticated: false,
    message: "Something went wrong",
  });
});

//delete user
router.delete("/delete_user", async (req, res) => {
  if (!req.body?.userId)
    return res.json({ success: false, message: "Not a valid userId." });
  let deletedUser = await User.destroy(req.body.userId);
  console.log("deletedUser ", deletedUser);
  if (deletedUser.id) {
    res.json({ success: true, message: "User deleted successfully." });
  } else {
    res.json({ success: false, message: "User not deleted successfully." });
  }
});

//add user channels
router.post("/add_user_channel", async (req, res) => {
  const channelName = req.body.channelName;
  const currentUserId = req.body.currentUser;
  const targetUserId = Number(req.body.targetUser) || undefined;
  if (!channelName || !currentUserId || !targetUserId) {
    return res.json({ success: false, message: "Channel data not valid." });
  }

  const direct_channels = { id: uuidv4(), name: channelName };
  try {
    Promise.all(
      [currentUserId, targetUserId].map((userId) => {
        return User.findByPk(userId).then((user) => {
          if (user) {
            const existingArray = user.direct_channels;
            existingArray.push(direct_channels);
            return user.update({
              direct_channels: existingArray,
            });
          }
          return Promise.reject(
            new Error(`Record with ID ${userId} not found.`)
          );
        });
      })
    )
      .then((data) => {
        console.log("Arrays updated successfully.");
        return res.json({
          success: true,
          message: "Channel added successfully.",
        });
      })
      .catch((error) => {
        console.error("Error updating arrays:", error);
        return res.json({ success: false, message: "Channel not added. 1" });
      });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Channel not added." });
  }
});

//get users to start new chat with
router.get("/new_chat_users", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.json({ success: false, message: "userId is required." });
  }
  let users = await User.findAll({
    attributes: ["id", "username", "direct_channels", "fname", "lname"],
  });
  if (users) {
    const currentUserChannels = users
      .find((user) => user.id == userId)
      ?.direct_channels?.map((channel) => channel?.id);
    console.log("currentUserChannels => ", currentUserChannels);

    const userList = users.filter((user) => user.id != userId);
    let uniqueUsers = [];
    if (currentUserChannels.length) {
      uniqueUsers = userList.filter((item) => {
        const directChannels = item.direct_channels || "[]";
        return directChannels.length
          ? !directChannels.some((channel) =>
              currentUserChannels.includes(channel.id)
            )
          : true;
      });
    } else {
      uniqueUsers = userList;
    }

    return res.json({ success: true, payload: uniqueUsers });

  } else {
    return res.json({ success: false, message: "UserList not available." });
  }
});


module.exports = router;