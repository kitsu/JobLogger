
// Get the date of the previous Sunday
function PrevSunday(date: Date): moment.Moment {
    let mdate = moment(date);
    if (mdate.day() === 0) {
        return mdate.subtract(7, "days");
    }
    return moment(date).day(0);
};

// Return pair of dates from previous Sunday to next Monday around date
function DayToWeek(date: Date): Array<moment.Moment> {
    let sunday = PrevSunday(date);
    return [sunday, moment(sunday).add(8, "days")];
};

// Set Shown true for every log entry in the same week as date
function WeekOf(date: Date, logs: Array<ActLogModel | ConLogModel>): void {
    let [start, end] = DayToWeek(date);
    let logDate: moment.Moment;
    console.log(`Start: ${start.format("YYYY-MM-DD")}, End: ${end.format("YYYY-MM-DD")}`);
    for (let log of logs) {
        logDate = moment(log.LogDate());
        console.log(`Date: ${logDate.format("YYYY-MM-DD")}, Between: ${logDate.isBetween(start, end)}`);
        if (logDate.isBetween(start, end)) {
            log.Shown(true);
        } else {
            log.Shown(false);
        }
    }
};