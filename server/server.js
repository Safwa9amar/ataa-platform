// src/server.js
const cleanupOrphanedFiles = require("./tasks/cleanupOrphanedFiles");
const cleanupUnverifiedAccounts = require("./tasks/cleanupUnverifiedAccounts");
const handleTrialAccounts = require("./tasks/trialEndDateSchedule");
const server = require("./app");
const port = process.env.PORT || 5500;
// Start Server with Scheduled Tasks
server.listen(port, async () => {
  try {
    await cleanupUnverifiedAccounts();
    await cleanupOrphanedFiles();
    await handleTrialAccounts();
    console.log("Scheduled tasks executed successfully.");
  } catch (error) {
    console.error("Error executing scheduled tasks:", error);
  }
  console.log(`Express server is running at http://localhost:${port}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
