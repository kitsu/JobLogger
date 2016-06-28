var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function popoverAlert(notice) {
    $("#AlertInfo").text(notice);
    $("#AddAlertInfo").fadeIn(150).delay(1000).fadeOut(250);
}
function getAuthToken() {
    return $("#aspaft input").first().val();
}
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
    BaseLog.prototype.toJSON = function () {
        return ko.mapping.toJSON(this, this.Mapping);
    };
    BaseLog.prototype.addLog = function (form) {
        var data = this.toJSON();
        var AjaxOptions = {
            url: this.Urls.Add,
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken", getAuthToken());
            },
            contentType: "application/json",
            processData: false,
            data: data
        };
        console.log("Adding: ", data);
        $.ajax(AjaxOptions).done(this.Callbacks.Add);
    };
    BaseLog.prototype.updateLog = function (form) {
        var data = this.toJSON();
        var AjaxOptions = {
            url: this.Urls.Update + "/" + this.Id(),
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken", getAuthToken());
            },
            contentType: "application/json",
            processData: false,
            data: data
        };
        $.ajax(AjaxOptions).done(this.Callbacks.Update);
    };
    BaseLog.prototype.deleteLog = function (button) {
        var data = this.Id();
        var AjaxOptions = {
            url: this.Urls.Delete,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("RequestVerificationToken", getAuthToken());
            },
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
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Shown", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "toggleEdit"]
        };
    }
    return ActLogModel;
}(BaseLog));
var ContactType = {
    "0": "Application",
    "1": "Interview",
    "2": "Inquery",
};
var ContactMeans = {
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
        if (state === void 0) { state = "WA"; }
        _super.call(this, date);
        this.toggleEdit = function () {
            _this.Edit(!_this.Edit());
        };
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
        this.Urls.Add = "/LogLists/AddContact";
        this.Urls.Update = "/LogLists/EditContact";
        // This is used to exclude members from ko.toJSON
        this.Mapping = {
            "ignore": ["Mapping", "Urls", "Callbacks", "Edit", "Shown", "Id",
                "addLog", "updateLog", "deleteLog", "renderResult",
                "addressPrompt", "contactPrompt", "methodName",
                "meansName", "toggleEdit"]
        };
    }
    ConLogModel.prototype.addressPrompt = function () {
        if (this.ContactMeans() === "0")
            return "Website";
        return "Street address";
    };
    ConLogModel.prototype.contactPrompt = function () {
        if (parseInt(this.ContactMeans(), 10) <= 1)
            return "Name [E-mail]";
        return "Name/Booth";
    };
    ConLogModel.prototype.meansName = function () {
        var means = this.ContactMeans();
        return ContactMeans[means];
    };
    ConLogModel.prototype.TypeName = function () {
        var kind = this.ContactType();
        return ContactType[kind];
    };
    return ConLogModel;
}(BaseLog));
var AdditionModel = (function () {
    function AdditionModel() {
        var _this = this;
        this.onActSuccess = function (result) {
            if (result.success) {
                popoverAlert("Added Activity!");
                if (window.hasOwnProperty("listModel")) {
                    listModel.addAct(result.data);
                    _this.clearActModel();
                }
            }
            else {
                console.log("Couldn't add log!");
            }
        };
        this.onConSuccess = function (result) {
            if (result.success) {
                popoverAlert("Added Contact!");
                if (window.hasOwnProperty("listModel")) {
                    listModel.addCon(result.data);
                    _this.clearConModel();
                }
            }
            else {
                console.log("Couldn't add log!");
            }
        };
        var date = moment().format("YYYY-MM-DD");
        // Setup child models
        this.actModel = new ActLogModel(date);
        this.conModel = new ConLogModel(date);
        // Add callbacks
        this.actModel.Callbacks.Add = this.onActSuccess;
        this.conModel.Callbacks.Add = this.onConSuccess;
    }
    AdditionModel.prototype.clearActModel = function () {
        var model = this.actModel;
        model.Location("");
        model.Description("");
    };
    AdditionModel.prototype.clearConModel = function () {
        var model = this.conModel;
        model.Description("");
        model.ContactType("0");
        model.ContactMeans("0");
        model.Employer("");
        model.Contact("");
        model.Phone("");
        model.Address("");
        model.City("");
    };
    return AdditionModel;
}());
var ListModel = (function () {
    function ListModel() {
        var _this = this;
        this.updateList = function (result) {
            if (result.success === true) {
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
        this.toggleFiltered = function () {
            _this.Filtered(!_this.Filtered());
        };
        this.toggleSearched = function () {
            _this.Searched(!_this.Searched());
        };
        this.emailReport = function () {
            // Send server list of log ids to be emailed.
            var logs = [];
            for (var _i = 0, _a = _this.ShownLogs(); _i < _a.length; _i++) {
                var log = _a[_i];
                logs.push(log.Id());
            }
            var data = JSON.stringify(logs);
            var AjaxOptions = {
                url: "/LogLists/EmailReport/",
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("RequestVerificationToken", getAuthToken());
                },
                contentType: "application/json",
                processData: false,
                data: data
            };
            console.log("Emailing: ", data);
            $.ajax(AjaxOptions).done(function (result) {
                if (result.success === true) {
                    console.log("Email sent successfully!");
                }
                else {
                    console.log("Problem sending email!");
                }
            });
        };
        // Core members
        this.Logs = ko.observableArray([]);
        this.Count = ko.computed(function () { return _this.Logs().length; });
        // Search/filter control
        this.Filtered = ko.observable(false);
        this.FilterDate = ko.observable(moment().format("YYYY-MM-DD"));
        this.Searched = ko.observable(false);
        this.SearchString = ko.observable("");
        // Computed observables
        this.ShownLogs = ko.computed(function () {
            if (!_this.Filtered() && !_this.Searched()) {
                return _this.Logs();
            }
            var week = DayToWeek(_this.FilterDate());
            var matchWeek = true;
            var query = new RegExp(_this.SearchString(), "i");
            var matchSearch = true;
            return ko.utils.arrayFilter(_this.Logs(), function (log) {
                if (_this.Filtered()) {
                    matchWeek = InWeek(log.LogDate(), week);
                }
                if (_this.Searched()) {
                    matchSearch = SearchMatches(query, log);
                }
                // Note filters are cumulative
                return matchWeek && matchSearch;
            });
        });
        this.ShownCount = ko.computed(function () { return _this.ShownLogs().length; });
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
        this.Logs.unshift(actModel);
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
        conModel.ContactType(log.ContactType.toString());
        conModel.ContactMeans(log.ContactMeans.toString());
        conModel.Employer(log.Employer);
        conModel.Contact(log.Contact);
        conModel.Phone(log.Phone);
        conModel.Address(log.Address);
        conModel.City(log.City);
        conModel.State(log.State);
        this.Logs.unshift(conModel);
    };
    ListModel.prototype.logTemplate = function (log) {
        if (log instanceof ActLogModel) {
            return 'ActLogTemp';
        }
        return 'ConLogTemp';
    };
    ListModel.prototype.editTemplate = function (log) {
        if (log instanceof ActLogModel) {
            return 'EditActTemp';
        }
        return 'EditConTemp';
    };
    return ListModel;
}());
//# sourceMappingURL=LogModels.js.map