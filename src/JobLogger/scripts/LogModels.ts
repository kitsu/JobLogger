// Declaration of model instances created on page load
declare var addModel: AdditionModel;
declare var listModel: ListModel;

function popoverAlert(notice: string): void {
    $("#AlertInfo").text(notice);
    $("#AddAlertInfo").fadeIn(150).delay(1000).fadeOut(250);
}

interface ILogModel {
    Id: KnockoutObservable<string>;
    LogDate: KnockoutObservable<string>;
    Description : KnockoutObservable<string>;
    addLog(form: Element): void;
    updateLog(form: Element): void;
    deleteLog(button: Element): void;
}

type AnyLog = ActLogModel | ConLogModel;
type LogArray = Array<AnyLog>;

abstract class BaseLog implements ILogModel {
    Id: KnockoutObservable<string>;
    LogDate: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    Urls: any;
    Mapping: any;
    Callbacks: any;

    constructor(date: string = "") {
        this.Id = ko.observable("");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.Urls = {
            Add: "",
            Update: "",
            Delete: "/LogLists/Delete/",
        };
        this.Mapping = {};
        this.Callbacks = {
            Add: this.renderResult,
            Update: this.renderResult,
            Delete: this.renderResult,
        };
    }

    addLog(form: Element): void {
        let data: string = ko.mapping.toJSON(this, this.Mapping);
        let AjaxOptions: any = {
            url: this.Urls.Add,
            type: "POST",
            beforeSend: function (xhr: any) {
                xhr.setRequestHeader("RequestVerificationToken",
                                     $("#aspaft input").first().val());
            },
            contentType: "application/json",
            processData: false,
            data: data,
        };
        console.log("Adding: ", data);
        $.ajax(AjaxOptions).done(this.Callbacks.Add);
    }

    updateLog(form: Element): void {
        let data: string = ko.mapping.toJSON(this, this.Mapping);
        let AjaxOptions: any = {
            url: this.Urls.Update + "/" + this.Id(),
            type: "POST",
            beforeSend: function (xhr: any) {
                xhr.setRequestHeader("RequestVerificationToken",
                                     $("#aspaft input").first().val());
            },
            contentType: "application/json",
            processData: false,
            data: data,
        };
        $.ajax(AjaxOptions).done(this.Callbacks.Update);
    }

    deleteLog(button: Element): void {
        let data: string = this.Id();
        let AjaxOptions: any = {
            url: this.Urls.Delete,
            type: "DELETE",
            beforeSend: function (xhr: any) {
                xhr.setRequestHeader("RequestVerificationToken",
                                     $("#aspaft input").first().val());
            },
            data: { "target": data }
        };
        console.log("Deleting: ", data);
        $.ajax(AjaxOptions).done(this.Callbacks.Delete);
    }

    renderResult(data: JSON): void {
        console.log(data);
    }
}

class ActLogModel extends BaseLog implements ILogModel {
    // This is used to exclude members from ko.toJSON
    Location: KnockoutObservable<string>;
    // Flag set when editing this log
    Edit: KnockoutObservable<boolean>;

    constructor(date: string = "") {
        super(date);
        this.Location = ko.observable("");
        // Subclass state
        this.Edit = ko.observable(false);
        this.Urls.Add =  "/LogLists/AddActivity";
        this.Urls.Update =  "/LogLists/EditActivity";
        this.Mapping = {
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Shown", "Id",
                       "addLog", "updateLog", "deleteLog", "renderResult",
                       "toggleEdit"]
        };
    }

    toggleEdit = (): void => {
        this.Edit(!this.Edit());
    }
}

let ContactType: any = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
}

let ContactMeans: any = {
    "0": "Online",
    "1": "Mail",
    "2": "InPerson",
    "3": "Kiosk",
    "4": "Telephone",
    "5": "Fax",
}

class ConLogModel extends BaseLog implements ILogModel {
    ContactType: KnockoutObservable<string>;
    ContactMeans: KnockoutObservable<string>;
    Employer: KnockoutObservable<string>;
    Contact: KnockoutObservable<string>;
    Phone: KnockoutObservable<string>;
    Address: KnockoutObservable<string>;
    City: KnockoutObservable<string>;
    State: KnockoutObservable<string>;
    // Flag set when editing this log
    Edit: KnockoutObservable<boolean>;

    constructor(date: string = "", state: string = "WA") {
        super(date);
        this.ContactType = ko.observable("0");
        this.ContactMeans = ko.observable("0");
        this.Employer = ko.observable("");
        this.Contact = ko.observable("");
        this.Phone = ko.observable("");
        this.Address = ko.observable("");
        this.City = ko.observable("");
        this.State = ko.observable(state);
        // Subclass state
        this.Edit = ko.observable(false);
        this.Urls.Add =  "/LogLists/AddContact";
        this.Urls.Update =  "/LogLists/EditContact";
        // This is used to exclude members from ko.toJSON
        this.Mapping = {
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Shown", "Id",
                       "addLog", "updateLog", "deleteLog", "renderResult",
                        "addressPrompt", "contactPrompt", "methodName",
                        "meansName", "toggleEdit"]
        };
    }

    toggleEdit = (): void => {
        this.Edit(!this.Edit());
    }

    addressPrompt(): string {
        if (this.ContactMeans() === "0") return "Website";
        return "Street address";
    }

    contactPrompt(): string {
        if (parseInt(this.ContactMeans(), 10) <= 1) return "Name [E-mail]";
        return "Name/Booth";
    }

    meansName(): string {
        let means: string = this.ContactMeans();
        return ContactMeans[means];
    }

    TypeName(): string {
        let kind: string = this.ContactType();
        return ContactType[kind];
    }
}

class AdditionModel {
    actModel: ActLogModel;
    conModel: ConLogModel;

    constructor() {
        let date = moment().format("YYYY-MM-DD");
        // Setup child models
        this.actModel = new ActLogModel(date);
        this.conModel = new ConLogModel(date);
        // Add callbacks
        this.actModel.Callbacks.Add = this.onActSuccess
        this.conModel.Callbacks.Add = this.onConSuccess
    }

    clearActModel(): void {
        let model = this.actModel;
        model.Location("");
        model.Description("");
    }

    clearConModel(): void {
        let model = this.conModel;
        model.Description("");
        model.ContactType("0");
        model.ContactMeans("0");
        model.Employer("");
        model.Contact("");
        model.Phone ("");
        model.Address("");
        model.City("");
    }

    onActSuccess = (result: any): void => {
        if (result.success) {
            popoverAlert("Added Activity!");
            if (window.hasOwnProperty("listModel")) {
                listModel.addAct(result.data);
                this.clearActModel();
            }
        } else {
            console.log("Couldn't add log!");
        }
    }

    onConSuccess = (result: any): void => {
        if (result.success) {
            popoverAlert("Added Contact!");
            if (window.hasOwnProperty("listModel")) {
                listModel.addCon(result.data);
                this.clearConModel();
            }
        } else {
            console.log("Couldn't add log!");
        }
    }
}

class ListModel {
    Logs: KnockoutObservableArray<AnyLog>;
    ShownLogs: KnockoutComputed<Array<AnyLog>>;
    Count: KnockoutComputed<number>;
    ShownCount: KnockoutComputed<number>;
    Filtered: KnockoutObservable<Boolean>;
    FilterDate: KnockoutObservable<string>;
    Searched: KnockoutObservable<Boolean>;
    SearchString: KnockoutObservable<string>;

    constructor() {
        // Core members
        this.Logs = ko.observableArray([]);
        this.Count = ko.computed(() => { return this.Logs().length });
        // Search/filter control
        this.Filtered = ko.observable(false);
        this.FilterDate = ko.observable(moment().format("YYYY-MM-DD"));
        this.Searched = ko.observable(false);
        this.SearchString = ko.observable("");
        // Computed observables
        this.ShownLogs = ko.computed(() => {
            if (!this.Filtered() && !this.Searched()) {
                return this.Logs();
            }
            let week = DayToWeek(this.FilterDate())
            let matchWeek = true;
            let query = new RegExp(this.SearchString(), "i");
            let matchSearch = true;
            return ko.utils.arrayFilter(this.Logs(), (log) => {
                if (this.Filtered()) {
                    matchWeek = InWeek(log.LogDate(), week);
                }
                if (this.Searched()) {
                    matchSearch = SearchMatches(query, log);
                }
                // Note filters are cumulative
                return matchWeek && matchSearch;
            });
        });
        this.ShownCount = ko.computed(() => { return this.ShownLogs().length });
    }

    updateList = (result: any): void => {
        if (result.success === true) {
            for (let log of result.data) {
                if (log.hasOwnProperty("Location")) {
                    this.addAct(log);
                } else {
                    this.addCon(log);
                }
            }
        }
    }

    addAct(log: any): void {
        // Build new model for this log
        let actModel = new ActLogModel(log.LogDate.slice(0, 10));
        // Setup callbacks
        actModel.Callbacks.Delete = (result: any) => {
            if (result.success) {
                this.Logs.remove(actModel);
            } else {
                console.log("Couldn't delete log!");
            }
        };
        actModel.Callbacks.Update = (result: any) => {
            if (result.success) {
                actModel.Edit(false);
            } else {
                console.log("Couldn't update log!");
            }
        };
        // Manually initialize member data
        actModel.Id(log.Id);
        actModel.Description(log.Description);
        actModel.Location(log.Location);
        this.Logs.unshift(actModel);
    }

    addCon(log: any): void {
        // Build new model for this log
        let conModel = new ConLogModel(log.LogDate.slice(0, 10));
        // Setup callbacks
        conModel.Callbacks.Delete = (result: any) => {
            if (result.success) {
                this.Logs.remove(conModel)
            } else {
                console.log("Couldn't delete log!");
            }
        };
        conModel.Callbacks.Update = (result: any) => {
            if (result.success) {
                conModel.Edit(false)
            } else {
                console.log("Couldn't update log!");
            }
        };
        // Manually initialize member data
        conModel.Id(log.Id);
        conModel.Description(log.Description);
        conModel.ContactType(log.ContactType.toString());
        conModel.ContactMeans(log.ContactMeans.toString());
        conModel.Employer(log.Employer);
        conModel.Contact(log.Contact);
        conModel.Phone(log.Phone);
        conModel.Address(log.Address);
        conModel.City(log.City);
        conModel.State(log.State);
        this.Logs.unshift(conModel);
    }

    toggleFiltered = (): void => {
        this.Filtered(!this.Filtered());
    }

    toggleSearched = (): void => {
        this.Searched(!this.Searched());
    }

    updateFiltering(): void {}

    logTemplate(log: AnyLog): string {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    }

    editTemplate(log: AnyLog): string {
        if (log instanceof ActLogModel) {
            return 'EditActTemp';
        }
        return 'EditConTemp';
    }
}