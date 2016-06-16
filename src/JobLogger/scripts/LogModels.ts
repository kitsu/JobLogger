
interface ILogModel {
    Id: KnockoutObservable<string>;
    LogDate: KnockoutObservable<string>;
    Description : KnockoutObservable<string>;
    addLog(form: Element, done: (result: JSON) => void): void;
    updateLog(form: Element, done: (result: JSON) => void): void;
    deleteLog(button: Element, done: (result: JSON) => void): void;
};

abstract class BaseLog implements ILogModel {
    Id: KnockoutObservable<string>;
    LogDate: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    AddUrl: string;
    Mapping: any;

    constructor(date: string = "") {
        this.Id = ko.observable("");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.AddUrl = "";
        this.Mapping = {};
    }

    addLog(form: Element, done = this.renderResult): void {
        let data: string = ko.mapping.toJSON(this, this.Mapping);
        let AjaxOptions: any = {
            url: this.AddUrl,
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        console.log("Adding: ", data);
        $.ajax(AjaxOptions).done(done);
    }

    updateLog(form: Element, done = this.renderResult): void {
        let data: string = ko.mapping.toJSON(this, this.Mapping);
        let AjaxOptions: any = {
            url: "/LogLists/Edit",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        $.ajax(AjaxOptions).done(done);
    }

    deleteLog(button: Element, done = this.renderResult): void {
        let data: string = this.Id();
        let AjaxOptions: any = {
            url: "/LogLists/Delete/",
            type: "DELETE",
            data: { "target": data }
        };
        console.log("Deleting: ", data);
        $.ajax(AjaxOptions).done(done);
    }

    renderResult(data: JSON): void {
        console.log(data);
    }
};


class ActLogModel extends BaseLog implements ILogModel {
    // This is used to exclude members from ko.toJSON
    Location: KnockoutObservable<string>;

    constructor(date: string = "") {
        super(date);
        this.Location = ko.observable("");
        this.AddUrl =  "/LogLists/AddActivity";
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Id",
                   "addLog", "updateLog", "deleteLog", "renderResult"]
        };
    }
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

    constructor(date: string = "", state: string = "Wa") {
        super(date);
        this.MethodType = ko.observable("0");
        this.MeansType = ko.observable("0");
        this.Employer = ko.observable("");
        this.Contact = ko.observable("");
        this.Phone = ko.observable("");
        this.Address = ko.observable("");
        this.City = ko.observable("");
        this.State = ko.observable(state);
        this.AddUrl =  "/LogLists/AddContact";
        // This is used to exclude members from ko.toJSON
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt"]
        };
    }

    addressPrompt(): string {
        if (this.MeansType() === "0") return "Website";
        return "Street address";
    }

    contactPrompt(): string {
        if (parseInt(this.MeansType(), 10) <= 1) return "Name [E-mail]";
        return "Name/Booth";
    }
}
