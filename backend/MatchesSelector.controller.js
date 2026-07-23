const { getAllMatches, getSpecificMatch } = require("./MatchesSelector.model");

const getMatchesToFollow = async (teamsToFollow) => {
  const allMatches = await getAllMatches();
  const matchesToFollow = allMatches.filter((match) => {
    const homeTeamName = match.local.club.abbreviatedName;
    const awayTeamName = match.road.club.abbreviatedName;
    return teamsToFollow.some(
      (team) =>
        team.teamName.includes(homeTeamName) ||
        team.teamName.includes(awayTeamName) ||
        homeTeamName.includes(team.teamName) ||
        awayTeamName.includes(team.teamName),
    );
  });
  return matchesToFollow;
};

const getPreviousMatch = (opp, round, matchesToFollow) => {
  let home;
  let away;
  if (round <= matchesToFollow.length / 2) return null;
  const playedGames = matchesToFollow.filter((match) => match?.played);
  const foundMatch = playedGames.find((match) => {
    home = match.local.club.abbreviatedName;
    away = match.road.club.abbreviatedName;
    return home === opp || away === opp;
  });
  const homeScore = foundMatch?.local?.score;
  const awayScore = foundMatch?.road?.score;
  return {
    date: foundMatch?.date?.toString(),
    round: foundMatch?.roundAlias,
    score: `${homeScore}-${awayScore}`,
    winner: homeScore > awayScore ? home : away,
  };
};

const getMatchByGameCode = async (gameCode) => {
  const foundMatch = await getSpecificMatch(gameCode);
  return foundMatch;
};

module.exports = {
  getMatchesToFollow,
  getPreviousMatch,
  getSpecificMatch,
  getMatchByGameCode,
};
