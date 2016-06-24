describe("PrevSunday", function () {
    it("given a Sunday returns the preceeding Sunday", function () {
        // This comming Sunday at the time of writing
        var date = new Date("Jun 26 2016");
        var sunday = PrevSunday(date);
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
    });
    it("returns the previous Sunday given some other date", function () {
        // Thursday at the time of writing
        var date = new Date("Jun 23 2016");
        var sunday = PrevSunday(date);
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
    });
});
describe("DayToWeek", function () {
    it("returns the previous Sunday and next Monday given any date", function () {
        // Thursday at the time of writing
        var date = new Date("Jun 23 2016");
        var _a = DayToWeek(date), sunday = _a[0], monday = _a[1];
        expect(sunday.day()).toEqual(0);
        expect(sunday.date()).toEqual(19);
        expect(monday.day()).toEqual(1);
        expect(monday.date()).toEqual(27);
    });
});
describe("WeekOf", function () {
    it("selects logs with dates in the week containing date", function () {
        // Thursday at the time of writing
        var date = new Date("Jun 23 2016");
        // Build array of logs with ids indicating containment in week
        var mdate = moment(date);
        var logs = [];
        var log;
        log = new ActLogModel(moment(mdate).add(2, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log);
        log = new ConLogModel(moment(mdate).add(5, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log);
        log = new ActLogModel(moment(mdate).subtract(7, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log);
        log = new ConLogModel(moment(mdate).subtract(2, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log);
        log = new ConLogModel(moment(mdate).add(4, "days").format("YYYY-MM-DD"));
        log.Id("out");
        logs.push(log);
        log = new ActLogModel(moment(mdate).add(1, "days").format("YYYY-MM-DD"));
        log.Id("in");
        logs.push(log);
        WeekOf(date, logs);
        for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
            var log_1 = logs_1[_i];
            if (log_1.Shown() === true) {
                expect(log_1.Id()).toEqual("in");
            }
            else {
                expect(log_1.Id()).toEqual("out");
            }
        }
        ;
    });
});
//# sourceMappingURL=testFilters.js.map