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

// Use the token generated with your updated scopes
oAuth2Client.setCredentials(token);

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

module.exports = gmail;
