// 1. import dotenv
require("dotenv").config();

// 2. import express
const express = require("express");

// 3. import cors
const cors = require("cors");

// 4. import database connection (connects automatically)
require("./config/db");

// 5. import routes
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 6. create server
const server = express();

// 7. use middleware
server.use(cors());
server.use(express.json());

// 9. use routes
server.use(eventRoutes);
server.use(adminRoutes);

// 10. test route
server.get("/", (req, res) => {
  res.status(200).send("Event Scheduler API running");
});

// 11. set port
const PORT = process.env.PORT || 5000;

// 12. start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
