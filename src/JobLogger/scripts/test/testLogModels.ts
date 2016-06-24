
describe("ActLogModel", () => {
    let model: ActLogModel = new ActLogModel("now");
    it("contains a LogDate", () => {
        expect(model.LogDate).toBeDefined();
    });
    it("sets date to first argument", () => {
        expect(model.LogDate()).toBe("now");
    });
    it("contains a Urls map", () => {
        expect(model.Urls)
            .toEqual(jasmine.objectContaining({
                Add: jasmine.any(String),
                Update: jasmine.any(String),
                Delete: jasmine.any(String),
            }));
    });
    it("contains a Mapping", () => {
        expect(model.Mapping).toBeDefined();
    });
    it("Mapping contains extra members", () => {
        expect(model.Mapping)
            .toEqual(jasmine.objectContaining({
                "ignore": jasmine.arrayContaining([
                    "Mapping", "Urls", "Callbacks"
                ])
            }));
    });
    it("contains a Callbacks map", () => {
        expect(model.Callbacks)
            .toEqual(jasmine.objectContaining({
                Add: jasmine.any(Function),
                Update: jasmine.any(Function),
                Delete: jasmine.any(Function),
            }));
    });
    it("contains an Edit flag", () => {
        expect(model.Edit).toBeDefined();
    });
    it("Edit is false by default", () => {
        expect(model.Edit()).toBe(false);
    });
    it("Edit is true after calling toggleEdit", () => {
        model.toggleEdit();
        expect(model.Edit()).toBe(true);
    });
});

describe("ConLogModel", () => {
    let model: ConLogModel = new ConLogModel("now", "SW");
    it("contains a LogDate", () => {
        expect(model.LogDate).toBeDefined();
    });
    it("sets date to first argument", () => {
        expect(model.LogDate()).toBe("now");
    });
    it("contains a State", () => {
        expect(model.State).toBeDefined();
    });
    it("sets State to second argument", () => {
        expect(model.State()).toBe("SW");
    });
    it("contains a Urls map", () => {
        expect(model.Urls)
            .toEqual(jasmine.objectContaining({
                Add: jasmine.any(String),
                Update: jasmine.any(String),
                Delete: jasmine.any(String),
            }));
    });
    it("contains a Mapping", () => {
        expect(model.Mapping).toBeDefined();
    });
    it("Mapping contains extra members", () => {
        expect(model.Mapping)
            .toEqual(jasmine.objectContaining({
                "ignore": jasmine.arrayContaining([
                    "Mapping", "Urls", "Callbacks"
                ])
            }));
    });
    it("contains a Callbacks map", () => {
        expect(model.Callbacks)
            .toEqual(jasmine.objectContaining({
                Add: jasmine.any(Function),
                Update: jasmine.any(Function),
                Delete: jasmine.any(Function),
            }));
    });
    it("contains an Edit flag", () => {
        expect(model.Edit).toBeDefined();
    });
    it("Edit is false by default", () => {
        expect(model.Edit()).toBe(false);
    });
    it("Edit is true after calling toggleEdit", () => {
        model.toggleEdit();
        expect(model.Edit()).toBe(true);
    });
});

describe("AdditionModel", () => {
    let model: AdditionModel = new AdditionModel();
    it("contains an actModel", () => {
        expect(model.actModel).toBeDefined();
    });
    it("contains a conModel", () => {
        expect(model.conModel).toBeDefined();
    });
    it("clearActModel clears fields of actModel", () => {
        model.actModel.Location("Someplace");
        model.actModel.Description("Something");
        model.clearActModel();
        expect(model.actModel.Location()).toBe("");
        expect(model.actModel.Description()).toBe("");
    });
    it("clearConModel clears fields of conModel", () => {
        model.conModel.Description("Something");
        model.conModel.ContactType("2");
        model.conModel.ContactMeans("4");
        model.conModel.Employer("Somewhere");
        model.conModel.Contact("Someone");
        model.conModel.Phone ("123-4567");
        model.conModel.Address("1234 street");
        model.conModel.City("Somewhere");
        model.clearConModel();
        expect(model.conModel.Description()).toBe("");
        expect(model.conModel.ContactType()).toBe("0");
        expect(model.conModel.ContactMeans()).toBe("0");
        expect(model.conModel.Employer()).toBe("");
        expect(model.conModel.Contact()).toBe("");
        expect(model.conModel.Phone()).toBe("");
        expect(model.conModel.Address()).toBe("");
        expect(model.conModel.City()).toBe("");
    });
    it("clearConModel doesn't clear State field", () => {
        model.conModel.State("SW");
        model.clearConModel();
        expect(model.conModel.State()).toBe("SW");
    });
});

function buildListModel(data: Array<any>): ListModel {
    let model: ListModel = new ListModel();
    model.updateList({
        success: true,
        data: data
    });
    return model;
}

describe("ListModel", () => {
    let actData: any = {
        LogDate: "2016-06-23",
        Description: "Something",
        Location: "Somewhere"
    };
    let conData: any = {
        LogDate: "2016-06-01",
        Description: "Something special",
        ContactType: "2",
        ContactMeans: "4",
        Employer: "Somewhere",
        Contact: "Someone",
        Phone: "123-4567",
        Address: "1234 street",
        City: "Somewhere",
        State: "SW",
    };
    // Test log addition behavior
    it("updating with activity adds ActLogModel instance", () => {
        let model = buildListModel([actData]);
        expect(model.Count()).toEqual(1);
        expect(model.Logs.pop() instanceof ActLogModel).toBe(true);
    });
    it("updating with contact adds ConLogModel instance", () => {
        let model = buildListModel([conData]);
        expect(model.Count()).toEqual(1);
        expect(model.Logs.pop() instanceof ConLogModel).toBe(true);
    });
    // Ensure list search/filter members
    it("contains Shown members", () => {
        let model = buildListModel([]);
        expect(model.ShownLogs).toBeDefined();
        expect(model.ShownCount).toBeDefined();
    });
    it("contains a Filtered flag", () => {
        let model = buildListModel([]);
        expect(model.Filtered).toBeDefined();
    });
    it("Filtered is false by default", () => {
        let model = buildListModel([]);
        expect(model.Filtered()).toBe(false);
    });
    it("Filtered is true after calling toggleFiltered", () => {
        let model = buildListModel([]);
        model.toggleFiltered();
        expect(model.Filtered()).toBe(true);
    });
    it("contains a Searched flag", () => {
        let model = buildListModel([]);
        expect(model.Searched).toBeDefined();
    });
    it("Searched is false by default", () => {
        let model = buildListModel([]);
        expect(model.Searched()).toBe(false);
    });
    it("Searched is true after calling toggleSearched", () => {
        let model = buildListModel([]);
        model.toggleSearched();
        expect(model.Searched()).toBe(true);
    });
    // Test list search/filter behavior
    it("Shown members default to normal values", () => {
        let model = buildListModel([actData, conData]);
        expect(model.ShownLogs()).toEqual(model.Logs());
        expect(model.ShownCount()).toEqual(model.Count());
    });
    it("Shown members only contain shown values", () => {
        let model = buildListModel([actData, conData]);
        model.FilterDate("2016-06-23");
        model.toggleFiltered()
        expect(model.ShownLogs()).toEqual([model.Logs()[1]]);
        expect(model.ShownCount()).toEqual(1);
    });
});
