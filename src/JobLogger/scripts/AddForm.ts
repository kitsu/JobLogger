// The following adapted from "KnockStrap" https://github.com/faulknercs/Knockstrap
ko.bindingHandlers["radio"] = {
    init: function (elem: Element, valueAccessor: KnockoutObservable<any>): void {
        if (!ko.isObservable(valueAccessor())) {
            throw new Error("A radio binding should only be used with observable values.");
        }

        $(elem).on("change", "input:radio", function (evt: Event): void {
            // add handler to event queue for defered execution
            setTimeout(() => {
                let radio: JQuery = $(evt.target);
                let value: any = valueAccessor();
                let newValue: string = radio.val();

                if (!radio.prop("disabled")) {
                    // this sets the observable
                    value(newValue);
                }
            }, 0);
        });
    },

    update: function (elem: Element, valueAccessor: KnockoutObservable<any>): void {
        let value: string = ko.unwrap(valueAccessor()) || "";
        let selector: string = 'input[value="' + value.replace(/"/g, '\\"') + '"]';
        let radioButton: JQuery = $(elem).find(selector);
        let radioButtonWrapper: JQuery; // the radio grouping label

        if (radioButton.length) {
            radioButtonWrapper = radioButton.parent();
            radioButtonWrapper.siblings().removeClass("active");
            radioButtonWrapper.addClass("active");
        } else {
            radioButtonWrapper = $(elem).find(".active");
            radioButtonWrapper.removeClass("active");
            radioButtonWrapper.find("input").prop("checked", false);
        }
    }
};

class ActLogModel {
    static AjaxOptions: any = {
        url: "/LogLists/AddActivity",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: "{}",
        dataType: "json"
    };
    LogDate: KnockoutObservable<string>;
    Description : KnockoutObservable<string>;
    Location: KnockoutObservable<string>;

    constructor() {
        let date: string = moment().format("YYYY-MM-DD");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.Location = ko.observable("");
    }

    postLog(form: Element): void {
        let data: string = ko.toJSON(this);
        ActLogModel.AjaxOptions.data = data;
        console.log("Posting: ", data);
        $.ajax(ActLogModel.AjaxOptions).done(this.renderResult);

    }

    renderResult(data: JSON): void {
        console.log(data);
    }
}

class ConLogModel {
    static AjaxOptions: any = {
        url: "/LogLists/AddContact",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: "{}",
        dataType: "json"
    };
    LogDate: KnockoutObservable<string>;
    Description: KnockoutObservable<string>;
    MethodType: KnockoutObservable<string>;
    MeansType: KnockoutObservable<string>;
    Employer: KnockoutObservable<string>;
    Contact: KnockoutObservable<string>;
    Phone: KnockoutObservable<string>;
    Address: KnockoutObservable<string>;
    City: KnockoutObservable<string>;
    State: KnockoutObservable<string>;

    constructor() {
        let date: string = moment().format("YYYY-MM-DD");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.MethodType = ko.observable("0");
        this.MeansType = ko.observable("0");
        this.Employer = ko.observable("");
        this.Contact = ko.observable("");
        this.Phone = ko.observable("");
        this.Address = ko.observable("");
        this.City = ko.observable("");
        this.State = ko.observable("Wa");
    }

    addressPrompt(): string {
        if (this.MeansType() === "0") return "Website";
        return "Street address";
    }

    contactPrompt(): string {
        if (parseInt(this.MeansType(), 10) <= 1) return "Name [E-mail]";
        return "Name/Booth";
    }

    postLog(form: Element): void {
        let data: string = ko.toJSON(this);
        ConLogModel.AjaxOptions.data = data;
        console.log("Posting: ", data);
        $.ajax(ConLogModel.AjaxOptions).done(this.renderResult);
    }

    renderResult(data: JSON): void {
        console.log(data);
    }
}

// setup all the models and bind them to the view
let actModel: ActLogModel = new ActLogModel();
ko.applyBindings(actModel, $("#LogActivity")[0]);
let conModel: ConLogModel = new ConLogModel();
ko.applyBindings(conModel, $("#LogContact")[0]);
