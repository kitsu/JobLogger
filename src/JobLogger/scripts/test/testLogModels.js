describe("ActLogModel", function () {
    var model = new ActLogModel("now");
    it("contains a LogDate", function () {
        expect(model.LogDate).toBeDefined();
    });
    it("sets date to first argument", function () {
        expect(model.LogDate()).toBe("now");
    });
    it("contains a Urls map", function () {
        expect(model.Urls)
            .toEqual(jasmine.objectContaining({
            Add: jasmine.any(String),
            Update: jasmine.any(String),
            Delete: jasmine.any(String),
        }));
    });
    it("contains a Mapping", function () {
        expect(model.Mapping).toBeDefined();
    });
    it("Mapping contains extra members", function () {
        expect(model.Mapping)
            .toEqual(jasmine.objectContaining({
            "ignore": jasmine.arrayContaining([
                "Mapping", "Urls", "Callbacks"
            ])
        }));
    });
    it("contains a Callbacks map", function () {
        expect(model.Callbacks)
            .toEqual(jasmine.objectContaining({
            Add: jasmine.any(Function),
            Update: jasmine.any(Function),
            Delete: jasmine.any(Function),
        }));
    });
    it("contains a Edit flag", function () {
        expect(model.Edit).toBeDefined();
    });
    it("Edit is false by default", function () {
        expect(model.Edit()).toBe(false);
    });
    it("Edit is true after calling toggleEdit", function () {
        model.toggleEdit();
        expect(model.Edit()).toBe(true);
    });
    it("contains a Shown flag", function () {
        expect(model.Shown).toBeDefined();
    });
    it("Shown is true by default", function () {
        expect(model.Shown()).toBe(true);
    });
});
describe("ConLogModel", function () {
    var model = new ConLogModel("now", "SW");
    it("contains a LogDate", function () {
        expect(model.LogDate).toBeDefined();
    });
    it("sets date to first argument", function () {
        expect(model.LogDate()).toBe("now");
    });
    it("contains a State", function () {
        expect(model.State).toBeDefined();
    });
    it("sets State to second argument", function () {
        expect(model.State()).toBe("SW");
    });
    it("contains a Urls map", function () {
        expect(model.Urls)
            .toEqual(jasmine.objectContaining({
            Add: jasmine.any(String),
            Update: jasmine.any(String),
            Delete: jasmine.any(String),
        }));
    });
    it("contains a Mapping", function () {
        expect(model.Mapping).toBeDefined();
    });
    it("Mapping contains extra members", function () {
        expect(model.Mapping)
            .toEqual(jasmine.objectContaining({
            "ignore": jasmine.arrayContaining([
                "Mapping", "Urls", "Callbacks"
            ])
        }));
    });
    it("contains a Callbacks map", function () {
        expect(model.Callbacks)
            .toEqual(jasmine.objectContaining({
            Add: jasmine.any(Function),
            Update: jasmine.any(Function),
            Delete: jasmine.any(Function),
        }));
    });
    it("contains a Edit flag", function () {
        expect(model.Edit).toBeDefined();
    });
    it("Edit is false by default", function () {
        expect(model.Edit()).toBe(false);
    });
    it("Edit is true after calling toggleEdit", function () {
        model.toggleEdit();
        expect(model.Edit()).toBe(true);
    });
    it("contains a Shown flag", function () {
        expect(model.Shown).toBeDefined();
    });
    it("Shown is true by default", function () {
        expect(model.Shown()).toBe(true);
    });
});
describe("AdditionModel", function () {
    var model = new AdditionModel();
    it("contains an actModel", function () {
        expect(model.actModel).toBeDefined();
    });
    it("contains a conModel", function () {
        expect(model.conModel).toBeDefined();
    });
    it("clearActModel clears fields of actModel", function () {
        model.actModel.Location("Someplace");
        model.actModel.Description("Something");
        model.clearActModel();
        expect(model.actModel.Location()).toBe("");
        expect(model.actModel.Description()).toBe("");
    });
    it("clearConModel clears fields of conModel", function () {
        model.conModel.Description("Something");
        model.conModel.ContactType("2");
        model.conModel.ContactMeans("4");
        model.conModel.Employer("Somewhere");
        model.conModel.Contact("Someone");
        model.conModel.Phone("123-4567");
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
    it("clearConModel doesn't clear State field", function () {
        model.conModel.State("SW");
        model.clearConModel();
        expect(model.conModel.State()).toBe("SW");
    });
});
function buildListModel(data) {
    var model = new ListModel();
    model.updateList({
        success: true,
        data: data
    });
    return model;
}
describe("ListModel", function () {
    var actData = {
        LogDate: "Sometime",
        Description: "Something",
        Location: "Somewhere"
    };
    var conData = {
        LogDate: "Sometime",
        Description: "Something",
        ContactType: "2",
        ContactMeans: "4",
        Employer: "Somewhere",
        Contact: "Someone",
        Phone: "123-4567",
        Address: "1234 street",
        City: "Somewhere",
        State: "SW",
    };
    it("updating with activity adds ActLogModel instance", function () {
        var model = buildListModel([actData]);
        expect(model.Count()).toEqual(1);
        expect(model.Logs.pop() instanceof ActLogModel).toBe(true);
    });
    it("updating with contact adds ConLogModel instance", function () {
        var model = buildListModel([conData]);
        expect(model.Count()).toEqual(1);
        expect(model.Logs.pop() instanceof ConLogModel).toBe(true);
    });
    it("contains Shown members", function () {
        var model = buildListModel([]);
        expect(model.ShownLogs).toBeDefined();
        expect(model.ShownCount).toBeDefined();
    });
    it("Shown members default to normal values", function () {
        var model = buildListModel([actData, conData]);
        expect(model.ShownLogs()).toEqual(model.Logs());
        expect(model.ShownCount()).toEqual(model.Count());
    });
    it("Shown members only contain shown values", function () {
        var model = buildListModel([actData, conData]);
        model.Logs()[0].Shown(false);
        expect(model.ShownLogs()).toEqual([model.Logs()[1]]);
        expect(model.ShownCount()).toEqual(1);
    });
});
//# sourceMappingURL=testLogModels.js.map