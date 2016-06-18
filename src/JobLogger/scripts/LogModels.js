var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseLog = (function () {
    function BaseLog(date) {
        if (date === void 0) { date = ""; }
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
    BaseLog.prototype.addLog = function (form) {
        var data = ko.mapping.toJSON(this, this.Mapping);
        var AjaxOptions = {
            url: this.AddUrl,
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        console.log("Adding: ", data);
        $.ajax(AjaxOptions).done(this.Callbacks.Add);
    };
    BaseLog.prototype.updateLog = function (form) {
        var data = ko.mapping.toJSON(this, this.Mapping);
        var AjaxOptions = {
            url: "/LogLists/Edit",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: data,
        };
        $.ajax(AjaxOptions).done(this.Callbacks.Update);
    };
    BaseLog.prototype.deleteLog = function (button) {
        var data = this.Id();
        var AjaxOptions = {
            url: "/LogLists/Delete/",
            type: "DELETE",
            data: { "target": data }
        };
        console.log("Deleting: ", data);
        $.ajax(AjaxOptions).done(this.Callbacks.Delete);
    };
    BaseLog.prototype.renderResult = function (data) {
        console.log(data);
    };
    return BaseLog;
}());
var ActLogModel = (function (_super) {
    __extends(ActLogModel, _super);
    function ActLogModel(date) {
        if (date === void 0) { date = ""; }
        _super.call(this, date);
        this.Location = ko.observable("");
        this.AddUrl = "/LogLists/AddActivity";
        this.Mapping = {
            "ignore": ["Mapping", "AddUrl", "Callbacks", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult"]
        };
    }
    return ActLogModel;
}(BaseLog));
var ConMeans = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
};
var ConMethods = {
    "0": "Online",
    "1": "Mail",
    "2": "InPerson",
    "3": "Kiosk",
    "4": "Telephone",
    "5": "Fax",
};
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
            "ignore": ["Mapping", "AddUrl", "Callbacks", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt", "methodName", "meansName"]
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
    ConLogModel.prototype.meansName = function (means) {
        return ConMeans[this.MeansType()];
    };
    ConLogModel.prototype.methodName = function (method) {
        return ConMethods[this.MethodType()];
    };
    return ConLogModel;
}(BaseLog));
var AdditionModel = (function () {
    function AdditionModel() {
        var date = moment().format("YYYY-MM-DD");
        // Setup child models
        this.actModel = new ActLogModel(date);
        this.conModel = new ConLogModel(date);
        // Add callbacks
        this.actModel.Callbacks.Add = this.onActSuccess;
        this.conModel.Callbacks.Add = this.onConSuccess;
    }
    AdditionModel.prototype.onActSuccess = function (result) {
        if (result.success) {
            $("#LogList").prepend('<div class="alert alert-info">Activity log added!</div>');
        }
    };
    AdditionModel.prototype.onConSuccess = function (result) {
        if (result.success) {
            $("#LogList").prepend('<div class="alert alert-info">Contact log added!</div>');
        }
    };
    return AdditionModel;
}());
var ListModel = (function () {
    function ListModel() {
        var _this = this;
        this.updateList = function (result) {
            if (result.success === true) {
                console.log("Got " + result.data.length + " Logs!");
                for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                    var log = _a[_i];
                    if (log.hasOwnProperty("Location")) {
                        _this.addAct(log);
                    }
                    else {
                        _this.addCon(log);
                    }
                }
            }
        };
        this.Logs = ko.observableArray([]);
        this.Count = ko.computed(function () { return _this.Logs().length; });
    }
    ListModel.prototype.addAct = function (log) {
        var _this = this;
        var actModel = new ActLogModel(log.LogDate.slice(0, 10));
        actModel.Callbacks.Delete = function (result) {
            if (result.success) {
                console.log("Removing " + actModel.Id() + " from list!");
                _this.Logs.remove(actModel);
            }
        };
        actModel.Id(log.Id);
        actModel.Description(log.Description);
        actModel.Location(log.Location);
        this.Logs.push(actModel);
    };
    ListModel.prototype.addCon = function (log) {
        var _this = this;
        var conModel = new ConLogModel(log.LogDate.slice(0, 10));
        conModel.Callbacks.Delete = function () { _this.Logs.remove(conModel); };
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
    };
    ListModel.prototype.logTemplate = function (log) {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    };
    return ListModel;
}());
//# sourceMappingURL=LogModels.js.map