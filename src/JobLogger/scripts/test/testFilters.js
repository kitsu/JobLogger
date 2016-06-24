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
describe("InWeek", function () {
    var date = "2016-06-23";
    var week = DayToWeek(date);
    it("Returns true when provided date is in provided week", function () {
        // Thursday at the time of writing
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is before provided week", function () {
        // Thursday at the time of writing
        var date = "2016-06-01";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns false when provided date is after provided week", function () {
        // Thursday at the time of writing
        var date = "2016-06-30";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns true when provided date is preceeding Monday of week", function () {
        // Thursday at the time of writing
        var date = "2016-06-20";
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is preceeding Sunday of week", function () {
        // Thursday at the time of writing
        var date = "2016-06-19";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns true when provided date is Sunday of week", function () {
        // Thursday at the time of writing
        var date = "2016-06-26";
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is next Monday after week", function () {
        // Thursday at the time of writing
        var date = "2016-06-27";
        expect(InWeek(date, week)).toBe(false);
    });
});
//# sourceMappingURL=testFilters.js.map