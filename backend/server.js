const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const spaceObjectRoutes = require("./routes/spaceObjectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend çalışıyor");
});

app.use("/auth", authRoutes);
app.use("/space-objects", spaceObjectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});