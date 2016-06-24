
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

describe("InWeek", () => {
    let date = "2016-06-23";
    let week = DayToWeek(date);
    it("Returns true when provided date is in provided week", () => {
        // Thursday at the time of writing
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is before provided week", () => {
        // Thursday at the time of writing
        let date = "2016-06-01";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns false when provided date is after provided week", () => {
        // Thursday at the time of writing
        let date = "2016-06-30";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns true when provided date is preceeding Monday of week", () => {
        // Thursday at the time of writing
        let date = "2016-06-20";
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is preceeding Sunday of week", () => {
        // Thursday at the time of writing
        let date = "2016-06-19";
        expect(InWeek(date, week)).toBe(false);
    });
    it("Returns true when provided date is Sunday of week", () => {
        // Thursday at the time of writing
        let date = "2016-06-26";
        expect(InWeek(date, week)).toBe(true);
    });
    it("Returns false when provided date is next Monday after week", () => {
        // Thursday at the time of writing
        let date = "2016-06-27";
        expect(InWeek(date, week)).toBe(false);
    });
});

describe("SearchMatches", () => {
    let goodq = new RegExp("match", "i");
    let badq = new RegExp("missing", "i");
    // Activity log search
    it("given a query and an act log matches against location", () => {
        let log = new ActLogModel("now");
        log.Location("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an act log matches against description", () => {
        let log = new ActLogModel("now");
        log.Description("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a non-matching query and an act logreturns false", () => {
        let log = new ActLogModel("now");
        log.Location("This string contains a Match!");
        log.Description("This string contains a Match!");
        expect(SearchMatches(badq, log)).toBe(false);
    });
    // Contact log search
    it("given a query and an con log matches against Description", () => {
        let log = new ConLogModel("now");
        log.Description("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Employer", () => {
        let log = new ConLogModel("now");
        log.Employer("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Contact", () => {
        let log = new ConLogModel("now");
        log.Contact("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against Address", () => {
        let log = new ConLogModel("now");
        log.Address("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against City", () => {
        let log = new ConLogModel("now");
        log.City("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a query and an con log matches against State", () => {
        let log = new ConLogModel("now");
        log.State("This string contains a Match!");
        expect(SearchMatches(goodq, log)).toBe(true);
    });
    it("given a non-matching query and an con logreturns false", () => {
        let log = new ConLogModel("now");
        log.Description("This string contains a Match!");
        log.Employer("This string contains a Match!");
        log.Contact("This string contains a Match!");
        log.Address("This string contains a Match!");
        log.City("This string contains a Match!");
        log.State("This string contains a Match!");
        expect(SearchMatches(badq, log)).toBe(false);
    });
});

