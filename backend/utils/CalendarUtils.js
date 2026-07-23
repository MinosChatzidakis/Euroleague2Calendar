const { google } = require("googleapis");
const calendar = require("./CalendarClient");

// Insert a new event
const addToCalendar = async (event) => {
  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
    });

    console.log("✅ Event added:", res.data.summary);
    console.log("📅 Link:", res.data.htmlLink);

    return res.data; // contains id, htmlLink, summary, etc.
  } catch (error) {
    console.error("Error inserting event:", error);
    return null;
  }
};

// Get an event by ID
const getFromCalendar = async (eventId) => {
  try {
    const res = await calendar.events.get({
      calendarId: "primary",
      eventId,
    });
    return res.data;
  } catch (error) {
    console.error("Error getting event:", error);
    return null;
  }
};

// Update an event by ID
const updateEvent = async (eventId, match) => {
  try {
    const res = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      resource: match,
      sendUpdates: "all",
    });
    console.log("Event updated:", res.data.summary);
    return res.data;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
};

//get all events in the calendar
const getAllEvents = async () => {
  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date(0).toISOString(),
      maxResults: 2500,
    });
    return res.data.items || [];
  } catch (error) {
    console.log("error in fetching all events from calendar: ", error);
  }
};

//delete one specific event from the calendar using the id
const deleteEvent = async (eventId) => {
  try {
    console.log("deleting event: ", eventId);
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    console.log("deleted Event");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addToCalendar,
  getFromCalendar,
  updateEvent,
  getAllEvents,
  deleteEvent,
};
