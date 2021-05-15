const CronJob = require('cron').CronJob;
const timeZone = 'Europe/Stockholm';
export const isOutsideOperationalHours = (() => {
    const start = 10 * 60;
    const end =  20 * 60;
    const date = new Date(); 
    const now = date.getHours() * 60 + date.getMinutes();
    console.log({ start, end, now });
    return now <= start || now >= end;
})();

export const initializeCronJobs = (ctx) =>
    openJob(ctx) && closeJob(ctx); 

// Starts a cron job top enable RVC operations after 09:00.
const openJob = (ctx) => {
    const cronTime = '1 1 10 * * *';
    const onTick = () => ctx.closed = false;
    new CronJob(cronTime, onTick, null, true, timeZone);
}

// Starts a cron job to disable RVC operations after 21:00.
const closeJob = (ctx) => {
    const cronTime = '1 1 21 * * *';
    const onTick = () => ctx.closed = true;
    new CronJob(cronTime, onTick, null, true, timeZone);
}
