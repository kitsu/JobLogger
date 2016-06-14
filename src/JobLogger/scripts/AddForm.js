// The following adapted from "KnockStrap" https://github.com/faulknercs/Knockstrap
ko.bindingHandlers["radio"] = {
    init: function (elem, valueAccessor) {
        if (!ko.isObservable(valueAccessor())) {
            throw new Error("A radio binding should only be used with observable values.");
        }
        $(elem).on("change", "input:radio", function (evt) {
            // add handler to event queue for defered execution
            setTimeout(function () {
                var radio = $(evt.target);
                var value = valueAccessor();
                var newValue = radio.val();
                if (!radio.prop("disabled")) {
                    // this sets the observable
                    value(newValue);
                }
            }, 0);
        });
    },
    update: function (elem, valueAccessor) {
        var value = ko.unwrap(valueAccessor()) || "";
        var selector = 'input[value="' + value.replace(/"/g, '\\"') + '"]';
        var radioButton = $(elem).find(selector);
        var radioButtonWrapper; // the radio grouping label
        if (radioButton.length) {
            radioButtonWrapper = radioButton.parent();
            radioButtonWrapper.siblings().removeClass("active");
            radioButtonWrapper.addClass("active");
        }
        else {
            radioButtonWrapper = $(elem).find(".active");
            radioButtonWrapper.removeClass("active");
            radioButtonWrapper.find("input").prop("checked", false);
        }
    }
};
var ActLogModel = (function () {
    function ActLogModel() {
        var date = moment().format("YYYY-MM-DD");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.Location = ko.observable("");
    }
    ActLogModel.prototype.postLog = function (form) {
        var data = ko.toJSON(this);
        ActLogModel.AjaxOptions.data = data;
        console.log("Posting: ", data);
        $.ajax(ActLogModel.AjaxOptions).done(this.renderResult);
    };
    ActLogModel.prototype.renderResult = function (data) {
        console.log(data);
    };
    ActLogModel.AjaxOptions = {
        url: "/LogLists/AddActivity",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: "{}",
        dataType: "json"
    };
    return ActLogModel;
}());
var ConLogModel = (function () {
    function ConLogModel() {
        var date = moment().format("YYYY-MM-DD");
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
    ConLogModel.prototype.addressPrompt = function () {
        if (this.MeansType() === "0")
            return "Website";
        return "Street address";
    };
    ConLogModel.prototype.contactPrompt = function () {
        if (parseInt(this.MeansType(), 10) <= 1)
            return "Name [E-mail]";
        return "Name/Booth";
    };
    ConLogModel.prototype.postLog = function (form) {
        var data = ko.toJSON(this);
        ConLogModel.AjaxOptions.data = data;
        console.log("Posting: ", data);
        $.ajax(ConLogModel.AjaxOptions).done(this.renderResult);
    };
    ConLogModel.prototype.renderResult = function (data) {
        console.log(data);
    };
    ConLogModel.AjaxOptions = {
        url: "/LogLists/AddContact",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: "{}",
        dataType: "json"
    };
    return ConLogModel;
}());
// setup all the models and bind them to the view
var actModel = new ActLogModel();
ko.applyBindings(actModel, $("#LogActivity")[0]);
var conModel = new ConLogModel();
ko.applyBindings(conModel, $("#LogContact")[0]);
//# sourceMappingURL=AddForm.js.map