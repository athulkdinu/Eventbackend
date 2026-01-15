const Event = require("../models/Event");

//  convert hr → minutes
const toMinutes = (time) => {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m);
};

// ADD EVENT
exports.addEventController = async (req, res) => {
  const { title, description, date, startTime, endTime } = req.body;

  try {
    const events = await Event.find({ date });
    // check  overlap
    for (let e of events) {
      if (
        toMinutes(startTime) < toMinutes(e.endTime) &&
        toMinutes(endTime) > toMinutes(e.startTime)
      ) {
        return res.status(401).json({ success: false, message: "Time slot already booked" });
      }
    }

    const newEvent = new Event({ title, description, date, startTime, endTime });
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
    const events = await Event.find({ date }).sort({ startTime: 1 });
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
    const events = await Event.find({ date, _id: { $ne: id } });
    for (let e of events) {
      if (
        toMinutes(startTime) < toMinutes(e.endTime) &&
        toMinutes(endTime) > toMinutes(e.startTime)
      ) {
        return res.status(401).json({ success: false, message: "Time slot already booked" });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, date, startTime, endTime }, { new: true });

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
