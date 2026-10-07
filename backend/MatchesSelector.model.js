//const BASE_V2_URL = "https://api-live.euroleague.net/v2";
const BASE_V2_URL =
  "https://feeds.incrowdsports.com/provider/euroleague-feeds/v2";
const EUROLEAGUE_CODE = "E";
const SEASON_CODE = "E2026";
let RAW_DATA = null;

const getAllMatches = async () => {
  try {
    const response = await fetch(
      `${BASE_V2_URL}/competitions/${EUROLEAGUE_CODE}/seasons/${SEASON_CODE}/games?teamCode=OLY`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}, ${response.error?.message}`);
    }
    const result = await response.json();
    RAW_DATA = result; //store it locally to avoid triggering rate limits
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getSpecificMatch = async (gameCode) => {
  try {
    const response = await fetch(
      `${BASE_V2_URL}/competitions/${EUROLEAGUE_CODE}/seasons/${SEASON_CODE}/games/${gameCode}`,
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(`${response.status}, ${response.error?.message}`);
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllMatches, getSpecificMatch };
//make api call to get all the games for the season and export the results
