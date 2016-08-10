describe("PrevSunday", function () {
    it("given a Sunday returns the preceding Sunday", function () {
        // This coming Sunday at the time of writing
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
    it("Returns true when provided date is preceding Monday of week", function () {
        // Thursday at the time of writing
        var date = "2016-06-20";
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is preceding Sunday of week", function () {
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
describe("SearchMatches", function () {
    var goodq = new RegExp("match", "i");
    var badq = new RegExp("missing", "i");
    // Activity log search
    it("given a query and an act log matches against location", function () {
        var log = new ActLogModel("now");
        log.Location("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an act log matches against description", function () {
        var log = new ActLogModel("now");
        log.Description("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a non-matching query and an act log returns false", function () {
        var log = new ActLogModel("now");
        log.Location("This string contains a Match!");
        log.Description("This string contains a Match!");
        expect(SearchMatches(badq, log)).toBe(false);
    });
    // Contact log search
    it("given a query and an con log matches against Description", function () {
        var log = new ConLogModel("now");
        log.Description("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Employer", function () {
        var log = new ConLogModel("now");
        log.Employer("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Contact", function () {
        var log = new ConLogModel("now");
        log.Contact("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Address", function () {
        var log = new ConLogModel("now");
        log.Address("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against City", function () {
        var log = new ConLogModel("now");
        log.City("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against State", function () {
        var log = new ConLogModel("now");
        log.State("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a non-matching query and an con log returns false", function () {
        var log = new ConLogModel("now");
        log.Description("This string contains a Match!");
        log.Employer("This string contains a Match!");
        log.Contact("This string contains a Match!");
        log.Address("This string contains a Match!");
        log.City("This string contains a Match!");
        log.State("This string contains a Match!");
        expect(SearchMatches(badq, log)).toBe(false);
    });
});
//# sourceMappingURL=testFilters.js.map