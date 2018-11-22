'use strict';

var letter = {
    legalReg: [/^[a-zA-Z]{1,}$/],
    legalKeyCodeRange: [
        {
            min: 65,
            max: 90,
        },
    ],
};
var number = {
    legalReg: [/^[0-9]{1,}$/],
    legalKeyCodeRange: [
        {
            min: 48,
            max: 57,
        },
        {
            min: 96,
            max: 105,
        },
    ],
};
var decimal = {
    legalReg: [/[0-9.]{1,}$/],
    legalKeyCode: [8, 32, 37, 38, 39, 40, 46, 190],
    legalKeyCodeRange: [
        {
            min: 48,
            max: 57,
        },
        {
            min: 96,
            max: 105,
        },
    ],
};
var strategies = {
    letter: letter,
    number: number,
    decimal: decimal,
};

var defaultOptions = {
    legalReg: [],
    illegalReg: [],
    legalKeyCode: [8, 32, 37, 38, 39, 40, 46],
    legalKeyCodeRange: [],
    illegalKeyCode: [],
    illegalKeyCodeRange: [],
};
var Filter = /** @class */ (function () {
    function Filter(el, type, options) {
        var _this = this;
        this.filterStrategy = Object.assign({}, defaultOptions, options || strategies[type]);
        this.oldText = '';
        this.position = 0;
        el.oninput = function () {
            var text = el.value;
            _this.filterInput(el, text);
        };
        el.onkeydown = function (event) {
            _this.filterKeyCode(event);
        };
        el.onfocus = function () {
            _this.position = el.selectionStart;
            _this.oldText = el.value;
        };
    }
    Filter.prototype.checkKeyCode = function (keyCode) {
        var _a = this.filterStrategy, legalKeyCode = _a.legalKeyCode, legalKeyCodeRange = _a.legalKeyCodeRange, illegalKeyCode = _a.illegalKeyCode, illegalKeyCodeRange = _a.illegalKeyCodeRange;
        if (legalKeyCode.length > 0 || legalKeyCodeRange.length > 0) {
            if (legalKeyCode.some(function (code) {
                return code === keyCode;
            })) {
                return true;
            }
            if (legalKeyCodeRange.some(function (range) {
                return keyCode >= range.min && keyCode <= range.max;
            })) {
                return true;
            }
            return false;
        }
        else if (illegalKeyCode.length > 0 ||
            illegalKeyCodeRange.length > 0) {
            if (illegalKeyCode.some(function (code) {
                return code === keyCode;
            })) {
                return false;
            }
            if (illegalKeyCodeRange.some(function (range) {
                return keyCode >= range.min && keyCode <= range.max;
            })) {
                return false;
            }
            return true;
        }
        return true;
    };
    Filter.prototype.checkInput = function (input) {
        var _a = this.filterStrategy, legalReg = _a.legalReg, illegalReg = _a.illegalReg;
        if (legalReg.length > 0) {
            // 正向匹配模式，符合正则匹配则正确
            if (legalReg.some(function (reg) {
                return reg.test(input);
            })) {
                return true;
            }
            return false;
        }
        else if (illegalReg.length > 0) {
            // 反向匹配模式，符合正则匹配则错误
            if (illegalReg.some(function (reg) {
                return reg.test(input);
            })) {
                return false;
            }
            return true;
        }
        return true;
    };
    Filter.prototype.filterInput = function (textarea, text) {
        var _this = this;
        if (text.length < this.oldText.length) {
            this.oldText = text;
            return;
        }
        var selectionStart = textarea.selectionStart, selectionEnd = textarea.selectionEnd;
        if (selectionStart !== selectionEnd) {
            // 输入中文时
            this.position = selectionStart;
            return;
        }
        var newInput = '';
        if (selectionStart > text.length) {
            // 在文本后方输入
            newInput = text.substring(this.oldText.length);
            this.position = selectionStart;
        }
        else {
            // 在文本中间输入
            if (selectionStart !== selectionEnd) {
                // 如果是中文输入法
                newInput = text.substring(selectionStart, selectionEnd);
            }
            else {
                var inputLength = text.length - this.oldText.length;
                newInput = text.substr(selectionStart - inputLength, inputLength);
            }
        }
        var check = this.filterStrategy.oninput || this.checkInput;
        var testResult = check.call(this, newInput);
        if (testResult) {
            this.position = selectionStart;
            this.oldText = text;
        }
        else {
            if (selectionStart === selectionEnd) {
                textarea.value = this.oldText;
                setTimeout(function () {
                    textarea.value = _this.oldText;
                    textarea.setSelectionRange(_this.position, _this.position);
                }, 0);
            }
        }
    };
    Filter.prototype.filterKeyCode = function (event) {
        var keyCode = event.keyCode;
        var check = this.filterStrategy.onkeydown || this.checkKeyCode;
        if (!check.call(this, keyCode)) {
            event.preventDefault();
        }
    };
    return Filter;
}());

var index = {
    install: function (vue, options) {
        vue.directive('input-filter', {
            bind: function (el, binding, vnode) {
                var defaultType = binding.arg || false;
                var options = binding.value;
                var filter = new Filter(el, defaultType, options);
            },
        });
    },
};

module.exports = index;
