// backend/routes/eventRoutes.js

const express = require("express");
const router = express.Router();
const {
  addEventController,
  getEventsByDateController,
  updateEventController,
  deleteEventController,
} = require("../controllers/eventController");

// POST /events
router.post("/events", addEventController);

// GET /events?date=YYYY-MM-DD
router.get("/events", getEventsByDateController);

// PUT /events/:id
router.put("/events/:id", updateEventController);

// DELETE /events/:id
router.delete("/events/:id", deleteEventController);

module.exports = router;
