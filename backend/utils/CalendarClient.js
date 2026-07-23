// calendarClient.js
const fs = require("fs");
const { google } = require("googleapis");

const credentials = require("../config/oauth2.auth.json");
const token = require("../config/.token.json");

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oAuth2Client.setCredentials(token);

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

module.exports = calendar;
