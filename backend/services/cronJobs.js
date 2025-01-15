import cron from "node-cron";
import { deleteOldGroupMessages, deleteOldPersonalMessage } from "../controllers/message.controller.js";

// Cron job for deleting group messages (runs every hour)
cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup task for old group messages...");
  try {
    await deleteOldGroupMessages();
    console.log("Group message cleanup completed.");
  } catch (error) {
    console.error("Error during group message cleanup task:", error);
  }
});

// Cron job for deleting personal messages (runs once a day)
cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup task for old personal messages...");
  try {
    await deleteOldPersonalMessage();
    console.log("Personal message cleanup completed.");
  } catch (error) {
    console.error("Error during personal message cleanup task:", error);
  }
});

console.log("Cron jobs are set up.");
