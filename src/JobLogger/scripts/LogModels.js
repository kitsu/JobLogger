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
    BaseLog.prototype.addLog = function (form) {
        var data = ko.mapping.toJSON(this, this.Mapping);
        var AjaxOptions = {
            url: this.Urls.Add,
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
            url: this.Urls.Update + "/" + this.Id(),
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
            url: this.Urls.Delete,
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
        var _this = this;
        if (date === void 0) { date = ""; }
        _super.call(this, date);
        this.toggleEdit = function () {
            _this.Edit(!_this.Edit());
        };
        this.Location = ko.observable("");
        // Subclass state
        this.Edit = ko.observable(false);
        this.Urls.Add = "/LogLists/AddActivity";
        this.Urls.Update = "/LogLists/EditActivity";
        this.Mapping = {
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "toggleEdit"]
        };
    }
    return ActLogModel;
}(BaseLog));
var ConMethods = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
};
var ConMeans = {
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
        var _this = this;
        if (date === void 0) { date = ""; }
        if (state === void 0) { state = "Wa"; }
        _super.call(this, date);
        this.toggleEdit = function () {
            _this.Edit(!_this.Edit());
        };
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
        this.Urls.Add = "/LogLists/AddContact";
        this.Urls.Update = "/LogLists/EditContact";
        // This is used to exclude members from ko.toJSON
        this.Mapping = {
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt", "methodName",
                "meansName", "toggleEdit"]
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
    ConLogModel.prototype.meansName = function () {
        var means = this.MeansType();
        return ConMeans[means];
    };
    ConLogModel.prototype.methodName = function () {
        var method = this.MethodType();
        return ConMethods[method];
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
        else {
            console.log("Couldn't add log!");
        }
    };
    AdditionModel.prototype.onConSuccess = function (result) {
        if (result.success) {
            $("#LogList").prepend('<div class="alert alert-info">Contact log added!</div>');
        }
        else {
            console.log("Couldn't add log!");
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
        // Build new model for this log
        var actModel = new ActLogModel(log.LogDate.slice(0, 10));
        // Setup callbacks
        actModel.Callbacks.Delete = function (result) {
            if (result.success) {
                _this.Logs.remove(actModel);
            }
            else {
                console.log("Couldn't delete log!");
            }
        };
        actModel.Callbacks.Update = function (result) {
            if (result.success) {
                actModel.Edit(false);
            }
            else {
                console.log("Couldn't update log!");
            }
        };
        // Manually initialize member data
        actModel.Id(log.Id);
        actModel.Description(log.Description);
        actModel.Location(log.Location);
        this.Logs.push(actModel);
    };
    ListModel.prototype.addCon = function (log) {
        var _this = this;
        // Build new model for this log
        var conModel = new ConLogModel(log.LogDate.slice(0, 10));
        // Setup callbacks
        conModel.Callbacks.Delete = function (result) {
            if (result.success) {
                _this.Logs.remove(conModel);
            }
            else {
                console.log("Couldn't delete log!");
            }
        };
        conModel.Callbacks.Update = function (result) {
            if (result.success) {
                conModel.Edit(false);
            }
            else {
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
        this.Logs.push(conModel);
    };
    ListModel.prototype.logTemplate = function (log) {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    };
    ListModel.prototype.addTemplate = function (log) {
        if (log instanceof ActLogModel) {
            return 'LogActTemp';
        }
        return 'LogConTemp';
    };
    return ListModel;
}());
//# sourceMappingURL=LogModels.js.map