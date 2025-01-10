const { default: axios, HttpStatusCode } = require("axios");
const express = require("express");
const User = require("./models/user");
const router = express();
require("dotenv").config();

// USER
router.post("/github-user", async (req, res) => {
  const { user_name } = req.body;
  if (!user_name) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // check existing user
    const existingUser = await User.findOne({ user_name: user_name });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }
    // else add new user
    const gitResponse = await axios.get(
      `https://api.github.com/users/${user_name}`
    );

    const userDetails = gitResponse.data;

    const newUser = new User({
      user_name: userDetails.login,
      user_id: userDetails.id,
      avatar_url: userDetails.avatar_url,
      url: userDetails.url,
      followers_url: userDetails.followers_url,
      following_url: userDetails.following_url,
      type: userDetails.type,
      name: userDetails.name,
      location: userDetails.location,
      public_repos: userDetails.public_repos,
      public_gists: userDetails.public_gists,
      followers: userDetails.followers,
      following: userDetails.following,
      blog: userDetails.blog,
      bio: userDetails.bio,
      user_view_type: userDetails.user_view_type,
      friends: [],
      created_at: userDetails.created_at,
      updated_at: userDetails.updated_at,
      isDeleted: false,
      deletedAt: null,
    });
    await newUser.save();
    res.status(201).json({
      message: "User data saved successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(error.status).json({ message: error });
  }
});

// MUTUAL FRIENDS
router.get("/github-user-friends", async (req, res) => {
  const { user_name } = req.body;
  if (!user_name) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const followersResp = await axios.get(
      `https://api.github.com/users/${user_name}/followers`,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION_TOKEN,
        },
      }
    );

    const followingResp = await axios.get(
      `https://api.github.com/users/${user_name}/following`,
      {
        headers: {
          Authorization: process.env.AUTHORIZATION_TOKEN,
        },
      }
    );

    const followers = followersResp.data.map((user) => user.login);
    const following = followingResp.data.map((user) => user.login);

    const mutualFriends = followers.filter((user) => following.includes(user));
    console.log("mutual ", mutualFriends);

    const addFriendsToDb = await User.findOneAndUpdate(
      { user_name: user_name },
      { $set: { friends: mutualFriends } },
      { new: true }
    );
    console.log("ans", addFriendsToDb);

    res.status(200).json({
      message: "Friends updated successfully",
      uspdatedUser: addFriendsToDb,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// SEARCH USER BY location/ user_name;
router.get("/github-user/search-user", async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    return res.status(404).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ user_name: user_name });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while searching users", error });
  }
});

// SOFT DELETE user based on user_name
router.patch("/github-user/delete-user", async (req, res) => {
  const { user_name } = req.body;

  if (!user_name) {
    return res.status(404).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { user_name: user_name },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    console.log("adasdasd", user);

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ message: "User marked as deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking user as deleted", error });
  }
});

router.patch("/github-user/update-user", async (req, res) => {
  const { user_name } = req.body;
  const { location, blog, bio } = req.body;

  if (!user_name) {
    return res.status(400).json({ message: "Username is required" });
  }

  const updateFields = {};

  if (location) updateFields.location = location;
  if (blog) updateFields.blog = blog;
  if (bio) updateFields.bio = bio;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { user_name: user_name },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user", error });
  }
});

router.get("/github-user/sorted-users", async (req, res) => {
  const { sortBy, order } = req.query;

  const sortField = sortBy || "created_at";
  const sortOrder = order === "desc" ? -1 : 1;

  try {
    const sortedUsers = await User.find().sort({ [sortField]: sortOrder });
    res.status(200).json({ users: sortedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sorted users", error });
  }
});

module.exports = router;
