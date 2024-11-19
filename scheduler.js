const { startScheduler } = require('./utils/scheduler');

(async () => {
    console.log('Running scheduler...');
    await startScheduler();
    console.log('Scheduler completed.');
})();
