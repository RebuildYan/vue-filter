import strategies from './strategy.js';
const defaultOptions = {
    legalReg: [],
    illegalReg: [],
    legalKeyCode: [8, 32, 37, 38, 39, 40, 46], // 默认允许的keycode
    legalKeyCodeRange: [],
    illegalKeyCode: [],
    illegalKeyCodeRange: [],
    oninput: null,
    onkeydown: null
};

function checkKeyCode(keyCode, strategy) {
    const { legalKeyCode, legalKeyCodeRange, illegalKeyCode, illegalKeyCodeRange } = strategy;
    if (legalKeyCode.length > 0 || legalKeyCodeRange.length > 0) {
        if (legalKeyCode.some(code => {
            return code === keyCode;
        })) {
            return true;
        }
        if (legalKeyCodeRange.some(range => {
            return keyCode >= range.min && keyCode <= range.max;
        })) {
            return true;
        }
        return false;
    } else if (illegalKeyCode.length > 0 || illegalKeyCodeRange.length > 0) {
        if (illegalKeyCode.some(code => {
            return code === keyCode;
        })) {
            return false;
        }
        if (illegalKeyCodeRange.some(range => {
            return keyCode >= range.min && keyCode <= range.max;
        })) {
            return false;
        }
        return true;
    }
    return true;
}

function checkInput(input, strategy) {
    const { legalReg, illegalReg } = strategy;
    if (legalReg.length > 0) { // 正向匹配模式，符合正则匹配则正确
        if (legalReg.some(reg => {
            return reg.test(input);
        })) {
            return true;
        }
        return false;
    } else if (illegalReg.length > 0) { // 反向匹配模式，符合正则匹配则错误
        if (illegalReg.some(reg => {
            return reg.test(input);
        })) {
            return false;
        }
        return true;
    }
    return true;
}

export function Filter(el, filterType, options) {
    this.oldText = '';
    this.position = 0;
    const cloneDefaultOpiton = JSON.parse(JSON.stringify(defaultOptions));
    const strategy = options || strategies[filterType];
    this.strategy = Object.assign(cloneDefaultOpiton, strategy);
    this.el = el;
}

Filter.prototype.init = function () {
    this.el.oninput = () => {
        const text = this.el.value;
        this.filterInput(this.el, text);
    };
    this.el.onkeydown = (event) => {
        this.filterKeyCode(event);
    };
    this.el.onfocus = () => {
        this.position = this.el.selectionStart;
        this.oldText = this.el.value;
    };
};

Filter.prototype.filterInput = function (textarea, text) {
    if (text.length < this.oldText.length) {
        this.oldText = text;
        return;
    }
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart !== selectionEnd) { // 输入中文时
        this.position = selectionStart;
        return;
    }
    let newInput = '';
    if (selectionStart > text.length) { // 在文本后方输入
        newInput = text.substring(this.oldText.length);
        this.position = selectionStart;
    } else { // 在文本中间输入
        if (selectionStart !== selectionEnd) { // 如果是中文输入法
            newInput = text.substring(selectionStart, selectionEnd);
        } else {
            const inputLength = text.length - this.oldText.length;
            newInput = text.substr(selectionStart - inputLength, inputLength);
        }
    }
    const check = this.strategy.oninput || checkInput;
    const testResult = check(newInput, this.strategy);
    if (testResult) {
        this.position = selectionStart;
        this.oldText = text;
    } else {
        if (selectionStart === selectionEnd) {
            textarea.value = this.oldText;
            setTimeout(() => {
                textarea.value = this.oldText;
                textarea.setSelectionRange(this.position, this.position);
            }, 0);
        }
    }
};

Filter.prototype.filterKeyCode = function (event) {
    const keyCode = event.keyCode;
    const check = this.strategy.onkeydown || checkKeyCode;
    if (!check(keyCode, this.strategy)) {
        event.preventDefault();
    }
};

