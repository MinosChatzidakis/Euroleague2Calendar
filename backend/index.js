const fs = require("fs");
const {
  getMatchesToFollow,
  getPreviousMatch,
  getMatchByGameCode,
} = require("./MatchesSelector.controller"); //should be an array
//const { registryFile } = require("./newIndex");
const {
  addToCalendar,
  getFromCalendar,
  updateEvent,
} = require("./utils/CalendarUtils");
const { constructMatchupId } = require("./utils/utils");
const {
  addGameToRegistry,
  getGameFromRegistry,
  updateGameInRegistry,
} = require("./utils/RegistryUtils");
const { teamsToFollow, recipientsList } = require("./utils/generalVariables");

const MINUTES_PER_HOUR = 60;

(async () => {
  const matchesToFollow = await getMatchesToFollow(teamsToFollow);
  let matchesToBePlayed = [];
  let numOfUpdatedEvents = 0;
  matchesToBePlayed = matchesToFollow.filter((match) => !match.played);

  for (const match of matchesToBePlayed) {
    const apiGameCode = match.gameCode;
    const homeTeam = match.local.club.abbreviatedName;
    const awayTeam = match.road.club.abbreviatedName;
    const location = match.venue.name;
    const startDate = new Date(match.utcDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const matchup = constructMatchupId(homeTeam, awayTeam);
    const roundAlias = match.roundAlias;
    const phase = match.phaseType.name;
    const followedTeam = teamsToFollow.find(
      (t) =>
        t.teamName.includes(homeTeam) ||
        t.teamName.includes(awayTeam) ||
        awayTeam.includes(t.teamName) ||
        homeTeam.includes(t.teamName)
    );
    const isPlayingAtHome =
      homeTeam.includes(followedTeam.teamName) ||
      followedTeam.teamName.includes(homeTeam);
    const previousMatch = getPreviousMatch(
      isPlayingAtHome ? awayTeam : homeTeam,
      match.round,
      matchesToFollow
    );
    const notes = !previousMatch
      ? `${phase}, ${roundAlias}.`
      : `${phase}, ${roundAlias}.\nPlayed in ${previousMatch.round} on
          ${previousMatch.date.split("T")[0]}. \nResult: ${
          previousMatch.score
        }, ${previousMatch?.winner}`;

    const gameToAdd = {
      summary: matchup,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
      location: location,
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: MINUTES_PER_HOUR * 3 }],
      },
      colorId: followedTeam.primaryColor,
      description: notes,
      attendees: recipientsList.map((email) => ({ email })),
    };

    const gameInRegistry = getGameFromRegistry(matchup);
    if (!gameInRegistry) {
      //add event to calendar
      const eventObject = await addToCalendar(gameToAdd);
      const newEntry = {
        matchup,
        apiGameCode,
        idInCalendar: eventObject.id,
      };
      addGameToRegistry(newEntry);
    } else {
      const matchInCalendar = await getFromCalendar(
        gameInRegistry.idInCalendar
      );

      if (matchInCalendar) {
        const changesDetectedForEvent = [];
        startDate.toISOString() !== matchInCalendar.start.dateTime &&
          changesDetectedForEvent.push(
            `New start time: ${startDate.toISOString()}\n`
          );
        matchup !== matchInCalendar.summary &&
          changesDetectedForEvent.push(`New matchup: ${matchup}\n`);
        notes !== matchInCalendar.description &&
          changesDetectedForEvent.push(`New notes for event: ${notes}\n`);

        const updateFlag = changesDetectedForEvent.length > 1;

        if (updateFlag) {
          const updatedEvent = await updateEvent(
            gameInRegistry.idInCalendar,
            gameToAdd
          );
          updateGameInRegistry(matchup, {
            matchup,
            apiGameCode,
            idInCalendar: updatedEvent.id,
          });
          numOfUpdatedEvents++;
        }
      }
    }

    await new Promise((r) => setTimeout(r, 100));
  }
  console.log(
    `Updated ${numOfUpdatedEvents} events on ${new Date().toLocaleString()}.`
  );
})();
