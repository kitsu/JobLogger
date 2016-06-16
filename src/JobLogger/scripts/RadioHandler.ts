// The following adapted from "KnockStrap" https://github.com/faulknercs/Knockstrap
/* tslint:disable:no-string-literal quotemark */
ko.bindingHandlers["radio"] = {
    init: function (elem: Element, valueAccessor: KnockoutObservable<any>): void {
        if (!ko.isObservable(valueAccessor())) {
            throw new Error("A radio binding should only be used with observable values.");
        }

        $(elem).on("change", "input:radio", function (evt: Event): void {
            // Add handler to event queue for defered execution
            setTimeout(() => {
                let radio: JQuery = $(evt.target);
                let value: any = valueAccessor();
                let newValue: string = radio.val();

                if (!radio.prop("disabled")) {
                    // This sets the observable
                    value(newValue);
                }
            }, 0);
        });
    },

    update: function (elem: Element, valueAccessor: KnockoutObservable<any>): void {
        let value: string = ko.unwrap(valueAccessor()) || "";
        let selector: string = 'input[value="' + value.replace(/"/g, '\\"') + '"]';
        let radioButton: JQuery = $(elem).find(selector);
        let radioButtonWrapper: JQuery; // The radio grouping label

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
