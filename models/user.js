const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  user_id: { type: Number, required: true, unique: true },
  avatar_url: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  followers_url: { type: String, required: true, unique: true },
  following_url: { type: String, required: true, unique: true },
  type: { type: String },
  name: { type: String },
  location: { type: String },
  public_repos: { type: Number, required: true },
  public_gists: { type: Number, required: true },
  followers: { type: Number, required: false },
  following: { type: Number, required: false },
  blog: { type: String, required: false },
  bio: { type: String, required: false },
  user_view_type: { type: String, required: false },
  friends: { type: Array, required: false },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
