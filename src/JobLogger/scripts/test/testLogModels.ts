
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
    it("contains a Edit flag", () => {
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
    it("contains a Edit flag", () => {
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
