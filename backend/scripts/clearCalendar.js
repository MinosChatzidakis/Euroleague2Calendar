const { getAllEvents, deleteEvent } = require("../utils/CalendarUtils");
const { teamsToFollow } = require("../utils/generalVariables");
const fs = require("fs");

const clear = async () => {
  const allEvents = await getAllEvents();
  let deletedEvents = 0;
  for (const event of allEvents) {
    if (!event.summary) continue; // skip events without a summary

    if (
      teamsToFollow.some((team) =>
        event.summary.toLowerCase().includes(team.teamName.toLowerCase()),
      )
    ) {
      console.log("Deleting:", event.summary);
      await deleteEvent(event.id);
      deletedEvents++;
    }
  }
  fs.writeFileSync("./gamesInCalendar.json", "[]");
  console.log(`Deleted ${deletedEvents} events and emptied the registry`);
};

clear();
