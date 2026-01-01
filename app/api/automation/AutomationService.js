// Minimal AutomationService stub to satisfy app/api/init.js
// Implement real automation/cron logic here if available in the project.

const cron = require('node-cron');

function startMonthlyAutomation() {
  // Example: log startup and schedule a dummy monthly job. Keep lightweight.
  console.log('[AutomationService] startMonthlyAutomation called');

  // If you already have cron jobs elsewhere, keep this minimal to avoid duplicates.
  try {
    // Schedule a monthly job placeholder (runs every minute for dev/demo).
    // Replace with a proper schedule like '0 0 1 * *' for 1st of month at midnight.
    if (!global._monthlyAutomationScheduled) {
      global._monthlyAutomationScheduled = cron.schedule('* * * * *', () => {
        console.log('[AutomationService] monthly automation tick (dev placeholder)');
      });
      console.log('[AutomationService] scheduled placeholder job');
    }
  } catch (err) {
    console.warn('[AutomationService] Failed to schedule cron job:', err);
  }
}

module.exports = {
  startMonthlyAutomation,
};
