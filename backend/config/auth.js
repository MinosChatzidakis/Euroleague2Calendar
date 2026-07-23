const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const TOKEN_PATH = ".token.json";
const credentials = require("./oauth2.auth.json");

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

if (fs.existsSync(TOKEN_PATH)) {
  console.log("✅ Token already exists. No need to run again.");
  process.exit(0);
}

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("\n👉 Authorize this app by visiting this URL:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste the code here: ", (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error("❌ Error retrieving access token", err);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log("✅ Token stored at", TOKEN_PATH);
  });
});
