﻿// Declaration of model instances created on page load
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
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Id",
                       "addLog", "updateLog", "deleteLog", "renderResult",
                       "toggleEdit"]
        };
    }

    toggleEdit = (): void => {
        this.Edit(!this.Edit());
    }
}

let ConMethods: any = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
}

let ConMeans: any = {
    "0": "Online",
    "1": "Mail",
    "2": "InPerson",
    "3": "Kiosk",
    "4": "Telephone",
    "5": "Fax",
}

class ConLogModel extends BaseLog implements ILogModel {
    MethodType: KnockoutObservable<string>;
    MeansType: KnockoutObservable<string>;
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
        this.MethodType = ko.observable("0");
        this.MeansType = ko.observable("0");
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
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Id",
                       "addLog", "updateLog", "deleteLog", "renderResult",
                        "addressPrompt", "contactPrompt", "methodName",
                        "meansName", "toggleEdit"]
        };
    }

    toggleEdit = (): void => {
        this.Edit(!this.Edit());
    }

    addressPrompt(): string {
        if (this.MeansType() === "0") return "Website";
        return "Street address";
    }

    contactPrompt(): string {
        if (parseInt(this.MeansType(), 10) <= 1) return "Name [E-mail]";
        return "Name/Booth";
    }

    meansName(): string {
        let means: string = this.MeansType();
        return ConMeans[means];
    }

    methodName(): string {
        let method: string = this.MethodType();
        return ConMethods[method];
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
        model.MethodType("0");
        model.MeansType("0");
        model.Employer("");
        model.Contact("");
        model.Phone ("");
        model.Address("");
        model.City("");
        //model.State("WA");
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
    Logs: KnockoutObservableArray<ActLogModel | ConLogModel>;
    Count: KnockoutComputed<number>;

    constructor() {
        this.Logs = ko.observableArray([]);
        this.Count = ko.computed(() => { return this.Logs().length });
    }

    updateList = (result: any): void => {
        if (result.success === true) {
            console.log(`Got ${result.data.length} Logs!`);
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
                actModel.Edit(false)
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
        conModel.MethodType(log.MethodType.toString());
        conModel.MeansType(log.MeansType.toString());
        conModel.Employer(log.Employer);
        conModel.Contact(log.Contact);
        conModel.Phone(log.Phone);
        conModel.Address(log.Address);
        conModel.City(log.City);
        conModel.State(log.State);
        this.Logs.unshift(conModel);
    }

    logTemplate(log: ActLogModel | ConLogModel): string {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    }

    editTemplate(log: ActLogModel | ConLogModel): string {
        if (log instanceof ActLogModel) {
            return 'LogActTemp';
        }
        return 'LogConTemp';
    }
}