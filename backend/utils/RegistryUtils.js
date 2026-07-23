const fs = require("fs");

const registryFile = "./gamesInCalendar.json";

//helper function to get usable json data
/* const getRegistryContents = () => {
  try {
    let arr = [];
    const contents = fs.readFileSync(registryFile, "utf-8").trim();
    if (contents) {
      //json is empty --> skip to pushing to array since there is nothing to read
      arr = JSON.parse(contents);
      if (!Array.isArray(arr)) {
        console.log("invalid json array");
        arr = [];
      }
    } else {
      console.log("No contents in json registry file");
    }
    return Array.isArray(arr) ? arr : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}; */

const getRegistryContents = () => {
  try {
    if (!fs.existsSync(registryFile)) {
      fs.writeFileSync(registryFile, "[]", "utf8");
      return [];
    }
    let contents = fs.readFileSync(registryFile, "utf-8").trim();
    if (!contents) {
      contents = "[]";
    }
    const arr = JSON.parse(contents);
    return Array.isArray(arr) ? arr : [];
  } catch (error) {
    console.error("getRegistryContents error:", error);
    return [];
  }
};

//get game based on the game's summary
const getGameFromRegistry = (gameMatchup) => {
  let arr = [];
  arr = getRegistryContents();
  const foundGame = arr.find((entry) => entry.matchup === gameMatchup.trim());
  return foundGame;
};

const addGameToRegistry = (gameObj) => {
  let arr = [];
  arr = getRegistryContents();
  arr.push(gameObj);
  try {
    fs.writeFileSync(registryFile, JSON.stringify(arr, null, 2));
  } catch (error) {
    console.log(error);
  }
};

const updateGameInRegistry = (matchup, updatedGameObj) => {
  let arr = [];
  arr = getRegistryContents();
  const indexToEdit = arr.findIndex((item) => item.matchup === matchup.trim());
  if (indexToEdit === -1) {
    console.log("Index not found.");
    return;
  }
  arr.splice(indexToEdit, 1, updatedGameObj);
  try {
    fs.writeFileSync(registryFile, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.log(e);
  }
};

/* const deleteGameInRegistry = (matchup) => {
  let arr = [];
  arr = getRegistryContents();
  arr.filter((entry) => entry.matchup !== matchup.tirm());
}; */

module.exports = {
  addGameToRegistry,
  getGameFromRegistry,
  updateGameInRegistry,
};
