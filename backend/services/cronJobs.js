import cron from "node-cron";
import { deleteOldGroupMessages } from "../controllers/message.controller.js";

// Schedule a job to run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup task for old group messages...");
  try {
    await deleteOldGroupMessages();
    console.log("Cleanup completed.");
  } catch (error) {
    console.error("Error during cleanup task:", error);
  }
});

console.log("Cron jobs are set up.");