/*!
 *  frontui v1.0.2
 *  by frontpay FE Team
 *  (c) 2016-06-15 www.frontpay.cn
 *  Licensed under Apache License
 */
!
    function(factory) {
        "function" == typeof define && define.amd ? define(["jquery"], factory) : factory(jQuery)
    } (function($) {
        $.extend($.fn, {
            validate: function(options) {
                if (!this.length) return void(options && options.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
                var validator = $.data(this[0], "validator");
                return validator ? validator: (this.attr("novalidate", "novalidate"), validator = new $.validator(options, this[0]), $.data(this[0], "validator", validator), validator.settings.onsubmit && (this.on("click.validate", ":submit",
                    function(event) {
                        validator.settings.submitHandler && (validator.submitButton = event.target),
                        $(this).hasClass("cancel") && (validator.cancelSubmit = !0),
                        void 0 !== $(this).attr("formnovalidate") && (validator.cancelSubmit = !0)
                    }), this.on("submit.validate",
                    function(event) {
                        function handle() {
                            var hidden, result;
                            return validator.settings.submitHandler ? (validator.submitButton && (hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm)), result = validator.settings.submitHandler.call(validator, validator.currentForm, event), validator.submitButton && hidden.remove(), void 0 !== result ? result: !1) : !0
                        }
                        return validator.settings.debug && event.preventDefault(),
                            validator.cancelSubmit ? (validator.cancelSubmit = !1, handle()) : validator.form() ? validator.pendingRequest ? (validator.formSubmitted = !0, !1) : handle() : (validator.focusInvalid(), !1)
                    })), validator)
            },
            valid: function() {
                var valid, validator, errorList;
                return $(this[0]).is("form") ? valid = this.validate().form() : (errorList = [], valid = !0, validator = $(this[0].form).validate(), this.each(function() {
                    valid = validator.element(this) && valid,
                        errorList = errorList.concat(validator.errorList)
                }), validator.errorList = errorList),
                    valid
            },
            rules: function(command, argument) {
                var settings, staticRules, existingRules, data, param, filtered, element = this[0];
                if (command) switch (settings = $.data(element.form, "validator").settings, staticRules = settings.rules, existingRules = $.validator.staticRules(element), command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument)),
                            delete existingRules.messages,
                            staticRules[element.name] = existingRules,
                        argument.messages && (settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages));
                        break;
                    case "remove":
                        return argument ? (filtered = {},
                            $.each(argument.split(/\s/),
                                function(index, method) {
                                    filtered[method] = existingRules[method],
                                        delete existingRules[method],
                                    "required" === method && $(element).removeAttr("aria-required")
                                }), filtered) : (delete staticRules[element.name], existingRules)
                }
                return data = $.validator.normalizeRules($.extend({},
                    $.validator.classRules(element), $.validator.attributeRules(element), $.validator.dataRules(element), $.validator.staticRules(element)), element),
                data.required && (param = data.required, delete data.required, data = $.extend({
                        required: param
                    },
                    data), $(element).attr("aria-required", "true")),
                data.remote && (param = data.remote, delete data.remote, data = $.extend(data, {
                    remote: param
                })),
                    data
            }
        }),
            $.extend($.expr[":"], {
                blank: function(a) {
                    return ! $.trim("" + $(a).val())
                },
                filled: function(a) {
                    return !! $.trim("" + $(a).val())
                },
                unchecked: function(a) {
                    return ! $(a).prop("checked")
                }
            }),
            $.validator = function(options, form) {
                this.settings = $.extend(!0, {},
                    $.validator.defaults, options),
                    this.currentForm = form,
                    this.init()
            },
            $.validator.format = function(source, params) {
                return 1 === arguments.length ?
                    function() {
                        var args = $.makeArray(arguments);
                        return args.unshift(source),
                            $.validator.format.apply(this, args)
                    }: (arguments.length > 2 && params.constructor !== Array && (params = $.makeArray(arguments).slice(1)), params.constructor !== Array && (params = [params]), $.each(params,
                    function(i, n) {
                        source = source.replace(new RegExp("\\{" + i + "\\}", "g"),
                            function() {
                                return n
                            })
                    }), source)
            },
            $.extend($.validator, {
                defaults: {
                    messages: {},
                    groups: {},
                    rules: {},
                    errorClass: "error",
                    validClass: "valid",
                    errorElement: "label",
                    focusCleanup: !1,
                    focusInvalid: !0,
                    errorContainer: $([]),
                    errorLabelContainer: $([]),
                    onsubmit: !0,
                    ignore: ":hidden",
                    ignoreTitle: !1,
                    onfocusin: function(element) {
                        this.lastActive = element,
                        this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(element)))
                    },
                    onfocusout: function(element) {
                        this.checkable(element) || !(element.name in this.submitted) && this.optional(element) || this.element(element)
                    },
                    onkeyup: function(element, event) {
                        var excludedKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                        9 === event.which && "" === this.elementValue(element) || -1 !== $.inArray(event.keyCode, excludedKeys) || (element.name in this.submitted || element === this.lastElement) && this.element(element)
                    },
                    onclick: function(element) {
                        element.name in this.submitted ? this.element(element) : element.parentNode.name in this.submitted && this.element(element.parentNode)
                    },
                    highlight: function(element, errorClass, validClass) {
                        "radio" === element.type ? this.findByName(element.name).addClass(errorClass).removeClass(validClass) : $(element).addClass(errorClass).removeClass(validClass)
                    },
                    unhighlight: function(element, errorClass, validClass) {
                        "radio" === element.type ? this.findByName(element.name).removeClass(errorClass).addClass(validClass) : $(element).removeClass(errorClass).addClass(validClass)
                    }
                },
                setDefaults: function(settings) {
                    $.extend($.validator.defaults, settings)
                },
                messages: {
                    required: "This field is required.",
                    remote: "Please fix this field.",
                    email: "Please enter a valid email address.",
                    url: "Please enter a valid URL.",
                    date: "Please enter a valid date.",
                    dateISO: "Please enter a valid date ( ISO ).",
                    number: "Please enter a valid number.",
                    digits: "Please enter only digits.",
                    creditcard: "Please enter a valid credit card number.",
                    equalTo: "Please enter the same value again.",
                    maxlength: $.validator.format("Please enter no more than {0} characters."),
                    minlength: $.validator.format("Please enter at least {0} characters."),
                    rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
                    range: $.validator.format("Please enter a value between {0} and {1}."),
                    max: $.validator.format("Please enter a value less than or equal to {0}."),
                    min: $.validator.format("Please enter a value greater than or equal to {0}.")
                },
                autoCreateRanges: !1,
                prototype: {
                    init: function() {
                        function delegate(event) {
                            var validator = $.data(this.form, "validator"),
                                eventType = "on" + event.type.replace(/^validate/, ""),
                                settings = validator.settings;
                            settings[eventType] && !$(this).is(settings.ignore) && settings[eventType].call(validator, this, event)
                        }
                        this.labelContainer = $(this.settings.errorLabelContainer),
                            this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm),
                            this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                            this.submitted = {},
                            this.valueCache = {},
                            this.pendingRequest = 0,
                            this.pending = {},
                            this.invalid = {},
                            this.reset();
                        var rules, groups = this.groups = {};
                        $.each(this.settings.groups,
                            function(key, value) {
                                "string" == typeof value && (value = value.split(/\s/)),
                                    $.each(value,
                                        function(index, name) {
                                            groups[name] = key
                                        })
                            }),
                            rules = this.settings.rules,
                            $.each(rules,
                                function(key, value) {
                                    rules[key] = $.validator.normalizeRule(value)
                                }),
                            $(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", delegate).on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate),
                        this.settings.invalidHandler && $(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler),
                            $(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
                    },
                    form: function() {
                        return this.checkForm(),
                            $.extend(this.submitted, this.errorMap),
                            this.invalid = $.extend({},
                                this.errorMap),
                        this.valid() || $(this.currentForm).triggerHandler("invalid-form", [this]),
                            this.showErrors(),
                            this.valid()
                    },
                    checkForm: function() {
                        this.prepareForm();
                        for (var i = 0,
                                 elements = this.currentElements = this.elements(); elements[i]; i++) this.check(elements[i]);
                        return this.valid()
                    },
                    element: function(element) {
                        var cleanElement = this.clean(element),
                            checkElement = this.validationTargetFor(cleanElement),
                            result = !0;
                        return this.lastElement = checkElement,
                            void 0 === checkElement ? delete this.invalid[cleanElement.name] : (this.prepareElement(checkElement), this.currentElements = $(checkElement), result = this.check(checkElement) !== !1, result ? delete this.invalid[checkElement.name] : this.invalid[checkElement.name] = !0),
                            $(element).attr("aria-invalid", !result),
                        this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                            this.showErrors(),
                            result
                    },
                    showErrors: function(errors) {
                        if (errors) {
                            $.extend(this.errorMap, errors),
                                this.errorList = [];
                            for (var name in errors) this.errorList.push({
                                message: errors[name],
                                element: this.findByName(name)[0]
                            });
                            this.successList = $.grep(this.successList,
                                function(element) {
                                    return ! (element.name in errors)
                                })
                        }
                        this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
                    },
                    resetForm: function() {
                        $.fn.resetForm && $(this.currentForm).resetForm(),
                            this.submitted = {},
                            this.lastElement = null,
                            this.prepareForm(),
                            this.hideErrors();
                        var i, elements = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                        if (this.settings.unhighlight) for (i = 0; elements[i]; i++) this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, "");
                        else elements.removeClass(this.settings.errorClass)
                    },
                    numberOfInvalids: function() {
                        return this.objectLength(this.invalid)
                    },
                    objectLength: function(obj) {
                        var i, count = 0;
                        for (i in obj) count++;
                        return count
                    },
                    hideErrors: function() {
                        this.hideThese(this.toHide)
                    },
                    hideThese: function(errors) {
                        errors.not(this.containers).text(""),
                            this.addWrapper(errors).hide()
                    },
                    valid: function() {
                        return 0 === this.size()
                    },
                    size: function() {
                        return this.errorList.length
                    },
                    focusInvalid: function() {
                        if (this.settings.focusInvalid) try {
                            $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                        } catch(e) {}
                    },
                    findLastActive: function() {
                        var lastActive = this.lastActive;
                        return lastActive && 1 === $.grep(this.errorList,
                                function(n) {
                                    return n.element.name === lastActive.name
                                }).length && lastActive
                    },
                    elements: function() {
                        var validator = this,
                            rulesCache = {};
                        return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function() {
                            return ! this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this),
                                this.name in rulesCache || !validator.objectLength($(this).rules()) ? !1 : (rulesCache[this.name] = !0, !0)
                        })
                    },
                    clean: function(selector) {
                        return $(selector)[0]
                    },
                    errors: function() {
                        var errorClass = this.settings.errorClass.split(" ").join(".");
                        return $(this.settings.errorElement + "." + errorClass, this.errorContext)
                    },
                    reset: function() {
                        this.successList = [],
                            this.errorList = [],
                            this.errorMap = {},
                            this.toShow = $([]),
                            this.toHide = $([]),
                            this.currentElements = $([])
                    },
                    prepareForm: function() {
                        this.reset(),
                            this.toHide = this.errors().add(this.containers)
                    },
                    prepareElement: function(element) {
                        this.reset(),
                            this.toHide = this.errorsFor(element)
                    },
                    elementValue: function(element) {
                        var val, $element = $(element),
                            type = element.type;
                        return "radio" === type || "checkbox" === type ? this.findByName(element.name).filter(":checked").val() : "number" === type && "undefined" != typeof element.validity ? element.validity.badInput ? !1 : $element.val() : (val = $element.val(), "string" == typeof val ? val.replace(/\r/g, "") : val)
                    },
                    check: function(element) {
                        element = this.validationTargetFor(this.clean(element));
                        var result, method, rule, rules = $(element).rules(),
                            rulesCount = $.map(rules,
                                function(n, i) {
                                    return i
                                }).length,
                            dependencyMismatch = !1,
                            val = this.elementValue(element);
                        for (method in rules) {
                            rule = {
                                method: method,
                                parameters: rules[method]
                            };
                            try {
                                if (result = $.validator.methods[method].call(this, val, element, rule.parameters), "dependency-mismatch" === result && 1 === rulesCount) {
                                    dependencyMismatch = !0;
                                    continue
                                }
                                if (dependencyMismatch = !1, "pending" === result) return void(this.toHide = this.toHide.not(this.errorsFor(element)));
                                if (!result) return this.formatAndAdd(element, rule),
                                    !1
                            } catch(e) {
                                throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e),
                                e instanceof TypeError && (e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method."),
                                    e
                            }
                        }
                        if (!dependencyMismatch) return this.objectLength(rules) && this.successList.push(element),
                            !0
                    },
                    customDataMessage: function(element, method) {
                        return $(element).data("msg" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase()) || $(element).data("msg")
                    },
                    customMessage: function(name, method) {
                        var m = this.settings.messages[name];
                        return m && (m.constructor === String ? m: m[method])
                    },
                    findDefined: function() {
                        for (var i = 0; i < arguments.length; i++) if (void 0 !== arguments[i]) return arguments[i];
                        return void 0
                    },
                    defaultMessage: function(element, method) {
                        return this.findDefined(this.customMessage(element.name, method), this.customDataMessage(element, method), !this.settings.ignoreTitle && element.title || void 0, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>")
                    },
                    formatAndAdd: function(element, rule) {
                        var message = this.defaultMessage(element, rule.method),
                            theregex = /\$?\{(\d+)\}/g;
                        "function" == typeof message ? message = message.call(this, rule.parameters, element) : theregex.test(message) && (message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters)),
                            this.errorList.push({
                                message: message,
                                element: element,
                                method: rule.method
                            }),
                            this.errorMap[element.name] = message,
                            this.submitted[element.name] = message
                    },
                    addWrapper: function(toToggle) {
                        return this.settings.wrapper && (toToggle = toToggle.add(toToggle.parent(this.settings.wrapper))),
                            toToggle
                    },
                    defaultShowErrors: function() {
                        var i, elements, error;
                        for (i = 0; this.errorList[i]; i++) error = this.errorList[i],
                        this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass),
                            this.showLabel(error.element, error.message);
                        if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (i = 0; this.successList[i]; i++) this.showLabel(this.successList[i]);
                        if (this.settings.unhighlight) for (i = 0, elements = this.validElements(); elements[i]; i++) this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                        this.toHide = this.toHide.not(this.toShow),
                            this.hideErrors(),
                            this.addWrapper(this.toShow).show()
                    },
                    validElements: function() {
                        return this.currentElements.not(this.invalidElements())
                    },
                    invalidElements: function() {
                        return $(this.errorList).map(function() {
                            return this.element
                        })
                    },
                    showLabel: function(element, message) {
                        var place, group, errorID, error = this.errorsFor(element),
                            elementID = this.idOrName(element),
                            describedBy = $(element).attr("aria-describedby");
                        error.length ? (error.removeClass(this.settings.validClass).addClass(this.settings.errorClass), error.html(message)) : (error = $("<" + this.settings.errorElement + ">").attr("id", elementID + "-error").addClass(this.settings.errorClass).html(message || ""), place = error, this.settings.wrapper && (place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(place) : this.settings.errorPlacement ? this.settings.errorPlacement(place, $(element)) : place.insertAfter(element), error.is("label") ? error.attr("for", elementID) : 0 === error.parents("label[for='" + elementID + "']").length && (errorID = error.attr("id").replace(/(:|\.|\[|\]|\$)/g, "\\$1"), describedBy ? describedBy.match(new RegExp("\\b" + errorID + "\\b")) || (describedBy += " " + errorID) : describedBy = errorID, $(element).attr("aria-describedby", describedBy), group = this.groups[element.name], group && $.each(this.groups,
                            function(name, testgroup) {
                                testgroup === group && $("[name='" + name + "']", this.currentForm).attr("aria-describedby", error.attr("id"))
                            }))),
                        !message && this.settings.success && (error.text(""), "string" == typeof this.settings.success ? error.addClass(this.settings.success) : this.settings.success(error, element)),
                            this.toShow = this.toShow.add(error)
                    },
                    errorsFor: function(element) {
                        var name = this.idOrName(element),
                            describer = $(element).attr("aria-describedby"),
                            selector = "label[for='" + name + "'], label[for='" + name + "'] *";
                        return describer && (selector = selector + ", #" + describer.replace(/\s+/g, ", #")),
                            this.errors().filter(selector)
                    },
                    idOrName: function(element) {
                        return this.groups[element.name] || (this.checkable(element) ? element.name: element.id || element.name)
                    },
                    validationTargetFor: function(element) {
                        return this.checkable(element) && (element = this.findByName(element.name)),
                            $(element).not(this.settings.ignore)[0]
                    },
                    checkable: function(element) {
                        return /radio|checkbox/i.test(element.type)
                    },
                    findByName: function(name) {
                        return $(this.currentForm).find("[name='" + name + "']")
                    },
                    getLength: function(value, element) {
                        switch (element.nodeName.toLowerCase()) {
                            case "select":
                                return $("option:selected", element).length;
                            case "input":
                                if (this.checkable(element)) return this.findByName(element.name).filter(":checked").length
                        }
                        return value.length
                    },
                    depend: function(param, element) {
                        return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : !0
                    },
                    dependTypes: {
                        "boolean": function(param) {
                            return param
                        },
                        string: function(param, element) {
                            return !! $(param, element.form).length
                        },
                        "function": function(param, element) {
                            return param(element)
                        }
                    },
                    optional: function(element) {
                        var val = this.elementValue(element);
                        return ! $.validator.methods.required.call(this, val, element) && "dependency-mismatch"
                    },
                    startRequest: function(element) {
                        this.pending[element.name] || (this.pendingRequest++, this.pending[element.name] = !0)
                    },
                    stopRequest: function(element, valid) {
                        this.pendingRequest--,
                        this.pendingRequest < 0 && (this.pendingRequest = 0),
                            delete this.pending[element.name],
                            valid && 0 === this.pendingRequest && this.formSubmitted && this.form() ? ($(this.currentForm).submit(), this.formSubmitted = !1) : !valid && 0 === this.pendingRequest && this.formSubmitted && ($(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
                    },
                    previousValue: function(element) {
                        return $.data(element, "previousValue") || $.data(element, "previousValue", {
                                old: null,
                                valid: !0,
                                message: this.defaultMessage(element, "remote")
                            })
                    },
                    destroy: function() {
                        this.resetForm(),
                            $(this.currentForm).off(".validate").removeData("validator")
                    }
                },
                classRuleSettings: {
                    required: {
                        required: !0
                    },
                    email: {
                        email: !0
                    },
                    url: {
                        url: !0
                    },
                    date: {
                        date: !0
                    },
                    dateISO: {
                        dateISO: !0
                    },
                    number: {
                        number: !0
                    },
                    digits: {
                        digits: !0
                    },
                    creditcard: {
                        creditcard: !0
                    }
                },
                addClassRules: function(className, rules) {
                    className.constructor === String ? this.classRuleSettings[className] = rules: $.extend(this.classRuleSettings, className)
                },
                classRules: function(element) {
                    var rules = {},
                        classes = $(element).attr("class");
                    return classes && $.each(classes.split(" "),
                        function() {
                            this in $.validator.classRuleSettings && $.extend(rules, $.validator.classRuleSettings[this])
                        }),
                        rules
                },
                normalizeAttributeRule: function(rules, type, method, value) { / min | max / .test(method) && (null === type || /number|range|text/.test(type)) && (value = Number(value), isNaN(value) && (value = void 0)),
                    value || 0 === value ? rules[method] = value: type === method && "range" !== type && (rules[method] = !0)
                },
                attributeRules: function(element) {
                    var method, value, rules = {},
                        $element = $(element),
                        type = element.getAttribute("type");
                    for (method in $.validator.methods)"required" === method ? (value = element.getAttribute(method), "" === value && (value = !0), value = !!value) : value = $element.attr(method),
                        this.normalizeAttributeRule(rules, type, method, value);
                    return rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) && delete rules.maxlength,
                        rules
                },
                dataRules: function(element) {
                    var method, value, rules = {},
                        $element = $(element),
                        type = element.getAttribute("type");
                    for (method in $.validator.methods) value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase()),
                        this.normalizeAttributeRule(rules, type, method, value);
                    return rules
                },
                staticRules: function(element) {
                    var rules = {},
                        validator = $.data(element.form, "validator");
                    return validator.settings.rules && (rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {}),
                        rules
                },
                normalizeRules: function(rules, element) {
                    return $.each(rules,
                        function(prop, val) {
                            if (val === !1) return void delete rules[prop];
                            if (val.param || val.depends) {
                                var keepRule = !0;
                                switch (typeof val.depends) {
                                    case "string":
                                        keepRule = !!$(val.depends, element.form).length;
                                        break;
                                    case "function":
                                        keepRule = val.depends.call(element, element)
                                }
                                keepRule ? rules[prop] = void 0 !== val.param ? val.param: !0 : delete rules[prop]
                            }
                        }),
                        $.each(rules,
                            function(rule, parameter) {
                                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter
                            }),
                        $.each(["minlength", "maxlength"],
                            function() {
                                rules[this] && (rules[this] = Number(rules[this]))
                            }),
                        $.each(["rangelength", "range"],
                            function() {
                                var parts;
                                rules[this] && ($.isArray(rules[this]) ? rules[this] = [Number(rules[this][0]), Number(rules[this][1])] : "string" == typeof rules[this] && (parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/), rules[this] = [Number(parts[0]), Number(parts[1])]))
                            }),
                    $.validator.autoCreateRanges && (null != rules.min && null != rules.max && (rules.range = [rules.min, rules.max], delete rules.min, delete rules.max), null != rules.minlength && null != rules.maxlength && (rules.rangelength = [rules.minlength, rules.maxlength], delete rules.minlength, delete rules.maxlength)),
                        rules
                },
                normalizeRule: function(data) {
                    if ("string" == typeof data) {
                        var transformed = {};
                        $.each(data.split(/\s/),
                            function() {
                                transformed[this] = !0
                            }),
                            data = transformed
                    }
                    return data
                },
                addMethod: function(name, method, message) {
                    $.validator.methods[name] = method,
                        $.validator.messages[name] = void 0 !== message ? message: $.validator.messages[name],
                    method.length < 3 && $.validator.addClassRules(name, $.validator.normalizeRule(name))
                },
                methods: {
                    required: function(value, element, param) {
                        if (!this.depend(param, element)) return "dependency-mismatch";
                        if ("select" === element.nodeName.toLowerCase()) {
                            var val = $(element).val();
                            return val && val.length > 0
                        }
                        return this.checkable(element) ? this.getLength(value, element) > 0 : value.length > 0
                    },
                    email: function(value, element) {
                        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
                    },
                    url: function(value, element) {
                        return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(value)
                    },
                    date: function(value, element) {
                        return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString())
                    },
                    dateISO: function(value, element) {
                        return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
                    },
                    number: function(value, element) {
                        return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
                    },
                    digits: function(value, element) {
                        return this.optional(element) || /^\d+$/.test(value)
                    },
                    creditcard: function(value, element) {
                        if (this.optional(element)) return "dependency-mismatch";
                        if (/[^0-9 \-]+/.test(value)) return ! 1;
                        var n, cDigit, nCheck = 0,
                            nDigit = 0,
                            bEven = !1;
                        if (value = value.replace(/\D/g, ""), value.length < 13 || value.length > 19) return ! 1;
                        for (n = value.length - 1; n >= 0; n--) cDigit = value.charAt(n),
                            nDigit = parseInt(cDigit, 10),
                        bEven && (nDigit *= 2) > 9 && (nDigit -= 9),
                            nCheck += nDigit,
                            bEven = !bEven;
                        return nCheck % 10 === 0
                    },
                    minlength: function(value, element, param) {
                        var length = $.isArray(value) ? value.length: this.getLength(value, element);
                        return this.optional(element) || length >= param
                    },
                    maxlength: function(value, element, param) {
                        var length = $.isArray(value) ? value.length: this.getLength(value, element);
                        return this.optional(element) || param >= length
                    },
                    rangelength: function(value, element, param) {
                        var length = $.isArray(value) ? value.length: this.getLength(value, element);
                        return this.optional(element) || length >= param[0] && length <= param[1]
                    },
                    min: function(value, element, param) {
                        return this.optional(element) || value >= param
                    },
                    max: function(value, element, param) {
                        return this.optional(element) || param >= value
                    },
                    range: function(value, element, param) {
                        return this.optional(element) || value >= param[0] && value <= param[1]
                    },
                    equalTo: function(value, element, param) {
                        var target = $(param);
                        return this.settings.onfocusout && target.off(".validate-equalTo").on("blur.validate-equalTo",
                            function() {
                                $(element).valid()
                            }),
                        value === target.val()
                    },
                    remote: function(value, element, param) {
                        if (this.optional(element)) return "dependency-mismatch";
                        var validator, data, previous = this.previousValue(element);
                        return this.settings.messages[element.name] || (this.settings.messages[element.name] = {}),
                            previous.originalMessage = this.settings.messages[element.name].remote,
                            this.settings.messages[element.name].remote = previous.message,
                            param = "string" == typeof param && {
                                    url: param
                                } || param,
                            previous.old === value ? previous.valid: (previous.old = value, validator = this, this.startRequest(element), data = {},
                                data[element.name] = value, $.ajax($.extend(!0, {
                                    mode: "abort",
                                    port: "validate" + element.name,
                                    dataType: "json",
                                    data: data,
                                    context: validator.currentForm,
                                    success: function(response) {
                                        var errors, message, submitted, valid = response === !0 || "true" === response;
                                        validator.settings.messages[element.name].remote = previous.originalMessage,
                                            valid ? (submitted = validator.formSubmitted, validator.prepareElement(element), validator.formSubmitted = submitted, validator.successList.push(element), delete validator.invalid[element.name], validator.showErrors()) : (errors = {},
                                                message = response || validator.defaultMessage(element, "remote"), errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message, validator.invalid[element.name] = !0, validator.showErrors(errors)),
                                            previous.valid = valid,
                                            validator.stopRequest(element, valid)
                                    }
                                },
                                param)), "pending")
                    }
                }
            });
        var ajax, pendingRequests = {};
        $.ajaxPrefilter ? $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            "abort" === settings.mode && (pendingRequests[port] && pendingRequests[port].abort(), pendingRequests[port] = xhr)
        }) : (ajax = $.ajax, $.ajax = function(settings) {
            var mode = ("mode" in settings ? settings: $.ajaxSettings).mode,
                port = ("port" in settings ? settings: $.ajaxSettings).port;
            return "abort" === mode ? (pendingRequests[port] && pendingRequests[port].abort(), pendingRequests[port] = ajax.apply(this, arguments), pendingRequests[port]) : ajax.apply(this, arguments)
        })
    }),
    function(factory) {
        "function" == typeof define && define.amd ? define(["jquery", "jquery.validate"], factory) : factory(jQuery)
    } (function($) {
        $.extend($.validator.messages, {
            required: "这是必填字段",
            remote: "请修正此字段",
            email: "请输入有效的电子邮件地址",
            url: "请输入有效的网址",
            date: "请输入有效的日期",
            dateISO: "请输入有效的日期 (YYYY-MM-DD)",
            number: "请输入有效的数字",
            digits: "只能输入数字",
            creditcard: "请输入有效的信用卡号码",
            equalTo: "你的输入不相同",
            extension: "请输入有效的后缀",
            maxlength: $.validator.format("最多可以输入 {0} 个字符"),
            minlength: $.validator.format("最少要输入 {0} 个字符"),
            rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
            range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
            max: $.validator.format("请输入不大于 {0} 的数值"),
            min: $.validator.format("请输入不小于 {0} 的数值")
        })
    }),
    function(root, factory) {
        "function" == typeof define && define.amd ? define(["jquery", "jquery.validate"], factory) : "object" == typeof exports ? module.exports = factory(require("jquery")) : factory(root.jQuery)
    } (this,
        function($) {
            function Plugin(options) {
                var config = $.extend({}, Validation.DEFAULTS, options);
                //return $(this).each(function() {
                    return $(this).validate(config)
                //})
            }
            jQuery.validator.addMethod("telphone",
                function(value, element) {
                    return this.optional(element) || /^1[3-9]{10}$/g.test(value)
                });
            var Validation = {};
            return Validation.DEFAULTS = {
                errorPlacement: function(error, element) {
                    $errElem = $('<div class="form-notice"><i></i></div>').append(error),
                        element.after($errElem.show()).parents(".form-group").addClass("has-error")
                },
                onfocusout: function(el) {
                    $(el).hasClass("error") && $(el).parents(".form-group").addClass("has-error").find(".form-notice").show()
                },
                success: function(label) {
                    label.parent().hide().parents(".form-group").removeClass("has-error");
                    label.parent().remove();
                },
                errorElement: "span"
            },
                $.fn.validation = Plugin,
                $.fn.validation.prototype = $.fn.validate.prototype,
                $.fn.validation
        });
