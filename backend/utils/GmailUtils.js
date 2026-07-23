const gmail = require("./GmailClient");

const sendEmail = async (to, subject, message) => {
  // Build the email in gmail format -- one complex string correctly formatted
  const emailLines = [
    `To: ${to}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    message,
  ];

  const email = emailLines.join("\n").trim();

  // Gmail API requires base64url encoding
  const encodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
