var CronJob = require('cron').CronJob;

const scraper = require('../worker/tasks/fetch-github').fetchGithub;
const fetchStackoverflow = require('./tasks/fetch-stackoverflow').fetchStackoverflow;

async function RunCron() {
  fetchStackoverflow();
}
// cron runs schedule every 6 hours
new CronJob('0 */6 * * *', RunCron, null, true, 'America/Los_Angeles');

