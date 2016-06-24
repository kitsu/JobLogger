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
// Filter predicate returning true when date is in span
function InWeek(date, _a) {
    var start = _a[0], end = _a[1];
    var mdate = moment(date);
    if (mdate.isBetween(start, end)) {
        return true;
    }
    return false;
}
// Filter predicate returning true when search string is in log data
function SearchMatches(query, log) {
    if (log instanceof ActLogModel) {
        return query.test(log.Location()) || query.test(log.Description());
    }
    else {
        var values = [log.Description(), log.Employer(), log.Contact(),
            log.Address(), log.City(), log.State()];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var val = values_1[_i];
            console.log(val);
            if (query.test(val) === true) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=Filters.js.map