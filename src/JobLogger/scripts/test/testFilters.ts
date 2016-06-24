
describe("PrevSunday", () => {
    it("given a Sunday returns the preceeding Sunday", () => {
        // This comming Sunday at the time of writing
        let date = new Date("Jun 26 2016");
        let sunday = PrevSunday(date);
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
    });
    it("returns the previous Sunday given some other date", () => {
        // Thursday at the time of writing
        let date = new Date("Jun 23 2016");
        let sunday = PrevSunday(date);
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
    });
});

describe("DayToWeek", () => {
    it("returns the previous Sunday and next Monday given any date", () => {
        // Thursday at the time of writing
        let date = new Date("Jun 23 2016");
        let [sunday, monday] = DayToWeek(date);
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
        expect(monday.day()).toEqual(1);
        expect(monday.date()).toEqual(27);
    });
});

describe("WeekOf", () => {
    it("selects logs with dates in the week containing date", () => {
        // Thursday at the time of writing
        let date = new Date("Jun 23 2016");
        // Build array of logs with ids indicating containment in week
        let mdate = moment(date);
        let logs: Array<ActLogModel | ConLogModel> = [];
        let log: ActLogModel | ConLogModel;
        log = new ActLogModel(moment(mdate).add(2, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log)
        log = new ConLogModel(moment(mdate).add(5, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log)
        log = new ActLogModel(moment(mdate).subtract(7, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log)
        log = new ConLogModel(moment(mdate).subtract(2, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log)
        log = new ConLogModel(moment(mdate).add(4, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log)
        log = new ActLogModel(moment(mdate).add(1, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log)
        WeekOf(date, logs);
        for (let log of logs) {
            if (log.Shown() === true) {
                expect(log.Id()).toEqual("in");
            } else {
                expect(log.Id()).toEqual("out");
            }
        };
    });
});
