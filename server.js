const express = require("express");
const route = require("./route");
const db = require("./db");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", route);

app.get("/", (req, res) => {
  return res.send("Server is working");
});
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
