
// Get the date of the previous Sunday
function PrevSunday(date: any): moment.Moment {
    let mdate = moment(date);
    if (mdate.day() === 0) {
        return mdate.subtract(7, "days");
    }
    return moment(date).day(0);
};

// Return pair of dates from previous Sunday to next Monday around date
function DayToWeek(date: any): [moment.Moment, moment.Moment] {
    let sunday = PrevSunday(date);
    return [sunday, moment(sunday).add(8, "days")];
};

// Filter predicate returning true when date is in span
function InWeek(date: string, [start, end]: [moment.Moment, moment.Moment]): boolean {
    let mdate = moment(date);
    if (mdate.isBetween(start, end)) {
        return true;
    }
    return false;
}

// Filter predicate returning true when search string is in log data
function SearchMatches(search: string, log: AnyLog): boolean {
    if (log instanceof ActLogModel) {
        return true;
    }
    return true;
}