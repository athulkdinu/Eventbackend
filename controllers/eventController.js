const Event = require("../models/Event");

// convert "HH:mm" (24h) → minutes from midnight
const toMinutes = (time) => {
  if (!time || typeof time !== "string") return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const getMinutesFromEvent = (event) => {
  const start = typeof event.startMinutes === "number" ? event.startMinutes : toMinutes(event.startTime);
  const end = typeof event.endMinutes === "number" ? event.endMinutes : toMinutes(event.endTime);
  return { start, end };
};

const overlaps = (events, startMinutes, endMinutes) => {
  return events.some((e) => {
    const { start, end } = getMinutesFromEvent(e);
    if (start === null || end === null) return false;
    return startMinutes < end && endMinutes > start;
  });
};

// ADD EVENT
exports.addEventController = async (req, res) => {
  const { title, description, date, startTime, endTime } = req.body;

  try {
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (startMinutes === null || endMinutes === null) {
      return res.status(400).json({ success: false, message: "Invalid time format" });
    }

    if (endMinutes <= startMinutes) {
      return res.status(400).json({ success: false, message: "End time must be after start time" });
    }

    const events = await Event.find({ date });
    if (overlaps(events, startMinutes, endMinutes)) {
      return res.status(409).json({ success: false, message: "Selected time overlaps with an existing event" });
    }

    const newEvent = new Event({title, description, date, startTime, endTime, startMinutes, endMinutes });
   

    await newEvent.save();
    res.status(200).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET EVENTS BY DATE
exports.getEventsByDateController = async (req, res) => {
  const { date } = req.query;
  try {
    const events = await Event.find({ date }).sort({ startMinutes: 1, startTime: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE EVENT
exports.updateEventController = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, startTime, endTime } = req.body;
  try {
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (startMinutes === null || endMinutes === null) {
      return res.status(400).json({ success: false, message: "Invalid time format" });
    }

    if (endMinutes <= startMinutes) {
      return res.status(400).json({ success: false, message: "End time must be after start time" });
    }

    const events = await Event.find({ date, _id: { $ne: id } });
    if (overlaps(events, startMinutes, endMinutes)) {
      return res.status(409).json({ success: false, message: "Selected time overlaps with an existing event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, startTime, endTime, startMinutes, endMinutes },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE 
exports.deleteEventController = async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
