var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
;
var BaseLog = (function () {
    function BaseLog(date) {
        if (date === void 0) { date = ""; }
        this.Id = ko.observable("");
        this.LogDate = ko.observable(date);
        this.Description = ko.observable("");
        this.AddUrl = "";
        this.Mapping = {};
    }
    BaseLog.prototype.addLog = function (form, done) {
        if (done === void 0) { done = this.renderResult; }
        var data = ko.mapping.toJSON(this, this.Mapping);
        var AjaxOptions = {
            url: this.AddUrl,
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        console.log("Adding: ", data);
        $.ajax(AjaxOptions).done(done);
    };
    BaseLog.prototype.updateLog = function (form, done) {
        if (done === void 0) { done = this.renderResult; }
        var data = ko.mapping.toJSON(this, this.Mapping);
        var AjaxOptions = {
            url: "/LogLists/Edit",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        $.ajax(AjaxOptions).done(done);
    };
    BaseLog.prototype.deleteLog = function (button, done) {
        if (done === void 0) { done = this.renderResult; }
        var data = this.Id();
        var AjaxOptions = {
            url: "/LogLists/Delete/",
            type: "DELETE",
            data: { "target": data }
        };
        console.log("Deleting: ", data);
        $.ajax(AjaxOptions).done(done);
    };
    BaseLog.prototype.renderResult = function (data) {
        console.log(data);
    };
    return BaseLog;
}());
;
var ActLogModel = (function (_super) {
    __extends(ActLogModel, _super);
    function ActLogModel(date) {
        if (date === void 0) { date = ""; }
        _super.call(this, date);
        this.Location = ko.observable("");
        this.AddUrl = "/LogLists/AddActivity";
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult"]
        };
    }
    return ActLogModel;
}(BaseLog));
var ConLogModel = (function (_super) {
    __extends(ConLogModel, _super);
    function ConLogModel(date, state) {
        if (date === void 0) { date = ""; }
        if (state === void 0) { state = "Wa"; }
        _super.call(this, date);
        this.MethodType = ko.observable("0");
        this.MeansType = ko.observable("0");
        this.Employer = ko.observable("");
        this.Contact = ko.observable("");
        this.Phone = ko.observable("");
        this.Address = ko.observable("");
        this.City = ko.observable("");
        this.State = ko.observable(state);
        this.AddUrl = "/LogLists/AddContact";
        // This is used to exclude members from ko.toJSON
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt"]
        };
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
    return ConLogModel;
}(BaseLog));
//# sourceMappingURL=LogModels.js.map