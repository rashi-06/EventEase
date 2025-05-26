import Event from "../model/Event.js";

export const createEvent = async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        time,
        venue,
        category,
        price,
        availableSeats,
        totalSeats,
        imageUrl,
      } = req.body;
  
      const event = new Event({
        title,
        description,
        date,
        time,
        venue,
        category,
        price,
        availableSeats,
        totalSeats,
        imageUrl,
        organizer: req.body.userId, // from authMiddleware
      });
      console.log("got the event details");
      
  
      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.log("errro while creating the event-->" , error.message);
      res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find().populate("organizer", "name email");
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};


export const getEventById = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id).populate("organizer", "name email");
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event", error: error.message });
    }
};


export const updateEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if req.body.userId === event.organizer
      if (event.organizer.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: "Not authorized to update this event" });
      }
  
      Object.assign(event, req.body);
      const updatedEvent = await event.save();
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if req.body.userId === event.organizer
      if (event.organizer.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this event" });
      }
  
      await event.remove();
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};