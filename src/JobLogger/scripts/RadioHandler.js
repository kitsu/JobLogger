// The following adapted from "KnockStrap" https://github.com/faulknercs/Knockstrap
/* tslint:disable:no-string-literal quotemark */
ko.bindingHandlers["radio"] = {
    init: function (elem, valueAccessor) {
        if (!ko.isObservable(valueAccessor())) {
            throw new Error("A radio binding should only be used with observable values.");
        }
        $(elem).on("change", "input:radio", function (evt) {
            // Add handler to event queue for defered execution
            setTimeout(function () {
                var radio = $(evt.target);
                var value = valueAccessor();
                var newValue = radio.val();
                if (!radio.prop("disabled")) {
                    // This sets the observable
                    value(newValue);
                }
            }, 0);
        });
    },
    update: function (elem, valueAccessor) {
        var value = ko.unwrap(valueAccessor()) || "";
        var selector = 'input[value="' + value.replace(/"/g, '\\"') + '"]';
        var radioButton = $(elem).find(selector);
        var radioButtonWrapper; // The radio grouping label
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
//# sourceMappingURL=RadioHandler.js.map