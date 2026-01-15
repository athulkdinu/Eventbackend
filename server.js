// load env
require("dotenv").config();

// imports
const express = require("express");
const cors = require("cors");

// db connection
require("./config/db");

// routes
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

// create server
const server = express();

// middleware
server.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eventfrontend-delta.vercel.app"
  ]
}));
server.use(express.json());

// routes
server.use(eventRoutes);
server.use(adminRoutes);

// test route
server.get("/", (req, res) => {
  res.send("Event Scheduler API running");
});

// port
const PORT = process.env.PORT || 5000;

// start
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
