
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
    AddUrl: string;
    Mapping: any;
    Callbacks: any;

    constructor(date: string = "") {
        this.Id = ko.observable("");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.AddUrl = "";
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
            url: this.AddUrl,
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
            url: "/LogLists/Edit",
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
            url: "/LogLists/Delete/",
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

    constructor(date: string = "") {
        super(date);
        this.Location = ko.observable("");
        this.AddUrl =  "/LogLists/AddActivity";
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Callbacks", "Id",
                   "addLog", "updateLog", "deleteLog", "renderResult"]
        };
    }
}

let ConMeans: any = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
}

let ConMethods: any = {
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
            "ignore": ["Mapping", "AddUrl", "Callbacks", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt", "methodName", "meansName"]
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

    meansName(means: string): string {
        return ConMeans[this.MeansType()];
    }

    methodName(method: string): string {
        return ConMethods[this.MethodType()];
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

    onActSuccess(result: any): void {
        if (result.success) {
            $("#LogList").prepend('<div class="alert alert-info">Activity log added!</div>');
        }
    }

    onConSuccess(result: any): void {
        if (result.success) {
            $("#LogList").prepend('<div class="alert alert-info">Contact log added!</div>');
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
            console.log("Got " + result.data.length + " Logs!");
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
        let actModel = new ActLogModel(log.LogDate.slice(0, 10));
        actModel.Callbacks.Delete = (result: any) => {
            if (result.success) {
                console.log("Removing " + actModel.Id() + " from list!");
                this.Logs.remove(actModel);
            }
        };
        actModel.Id(log.Id);
        actModel.Description(log.Description);
        actModel.Location(log.Location);
        this.Logs.push(actModel);
    }

    addCon(log: any): void {
        let conModel = new ConLogModel(log.LogDate.slice(0, 10));
        conModel.Callbacks.Delete = () => { this.Logs.remove(conModel) };
        conModel.Id(log.Id);
        conModel.Description(log.Description);
        conModel.MethodType(log.MethodType);
        conModel.MeansType(log.MeansType);
        conModel.Employer(log.Employer);
        conModel.Contact(log.Contact);
        conModel.Phone(log.Phone);
        conModel.Address(log.Address);
        conModel.City(log.City);
        conModel.State(log.State);
        this.Logs.push(conModel);
    }

    logTemplate(log: ActLogModel | ConLogModel): string {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    }
}