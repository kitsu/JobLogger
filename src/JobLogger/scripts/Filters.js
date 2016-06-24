// Get the date of the previous Sunday
function PrevSunday(date) {
    var mdate = moment(date);
    if (mdate.day() === 0) {
        return mdate.subtract(7, "days");
    }
    return moment(date).day(0);
}
;
// Return pair of dates from previous Sunday to next Monday around date
function DayToWeek(date) {
    var sunday = PrevSunday(date);
    return [sunday, moment(sunday).add(8, "days")];
}
;
// Set Shown true for every log entry in the same week as date
function WeekOf(date, logs) {
    var _a = DayToWeek(date), start = _a[0], end = _a[1];
    var logDate;
    console.log("Start: " + start.format("YYYY-MM-DD") + ", End: " + end.format("YYYY-MM-DD"));
    for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
        var log = logs_1[_i];
        logDate = moment(log.LogDate());
        console.log("Date: " + logDate.format("YYYY-MM-DD") + ", Between: " + logDate.isBetween(start, end));
        if (logDate.isBetween(start, end)) {
            log.Shown(true);
        }
        else {
            log.Shown(false);
        }
    }
    return logs;
}
;
//# sourceMappingURL=Filters.js.map