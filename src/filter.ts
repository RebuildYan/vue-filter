import strategies, { Strategy, StrategyOption } from './strategy';

type FilterType = 'nubmer' | 'letter' | 'decimal';

const defaultOptions: Strategy = {
    legalReg: [],
    illegalReg: [],
    legalKeyCode: [8, 32, 37, 38, 39, 40, 46], // 默认允许的keycode
    legalKeyCodeRange: [],
    illegalKeyCode: [],
    illegalKeyCodeRange: [],
};

export default class Filter {
    private filterStrategy: Strategy;
    private oldText: string;
    private position: number;

    constructor(el: any, type: FilterType, options: StrategyOption) {
        this.filterStrategy = (<any>Object).assign(
            {},
            defaultOptions,
            options || strategies[type]
        );
        this.oldText = '';
        this.position = 0;
        el.oninput = () => {
            const text = el.value;
            this.filterInput(el, text);
        };
        el.onkeydown = (event: any) => {
            this.filterKeyCode(event);
        };
        el.onfocus = () => {
            this.position = el.selectionStart;
            this.oldText = el.value;
        };
    }

    private checkKeyCode(keyCode: number): boolean {
        const {
            legalKeyCode,
            legalKeyCodeRange,
            illegalKeyCode,
            illegalKeyCodeRange,
        } = this.filterStrategy;
        if (legalKeyCode.length > 0 || legalKeyCodeRange.length > 0) {
            if (
                legalKeyCode.some(code => {
                    return code === keyCode;
                })
            ) {
                return true;
            }
            if (
                legalKeyCodeRange.some(range => {
                    return keyCode >= range.min && keyCode <= range.max;
                })
            ) {
                return true;
            }
            return false;
        } else if (
            illegalKeyCode.length > 0 ||
            illegalKeyCodeRange.length > 0
        ) {
            if (
                illegalKeyCode.some(code => {
                    return code === keyCode;
                })
            ) {
                return false;
            }
            if (
                illegalKeyCodeRange.some(range => {
                    return keyCode >= range.min && keyCode <= range.max;
                })
            ) {
                return false;
            }
            return true;
        }
        return true;
    }

    private checkInput(input: string): boolean {
        const { legalReg, illegalReg } = this.filterStrategy;
        if (legalReg.length > 0) {
            // 正向匹配模式，符合正则匹配则正确
            if (
                legalReg.some(reg => {
                    return reg.test(input);
                })
            ) {
                return true;
            }
            return false;
        } else if (illegalReg.length > 0) {
            // 反向匹配模式，符合正则匹配则错误
            if (
                illegalReg.some(reg => {
                    return reg.test(input);
                })
            ) {
                return false;
            }
            return true;
        }
        return true;
    }

    private filterInput(textarea: any, text: string): void {
        if (text.length < this.oldText.length) {
            this.oldText = text;
            return;
        }
        const { selectionStart, selectionEnd } = textarea;
        if (selectionStart !== selectionEnd) {
            // 输入中文时
            this.position = selectionStart;
            return;
        }
        let newInput = '';
        if (selectionStart > text.length) {
            // 在文本后方输入
            newInput = text.substring(this.oldText.length);
            this.position = selectionStart;
        } else {
            // 在文本中间输入
            if (selectionStart !== selectionEnd) {
                // 如果是中文输入法
                newInput = text.substring(selectionStart, selectionEnd);
            } else {
                const inputLength = text.length - this.oldText.length;
                newInput = text.substr(
                    selectionStart - inputLength,
                    inputLength,
                );
            }
        }
        const check = this.filterStrategy.oninput || this.checkInput;
        const testResult = check.call(this, newInput) && check.call(this, text);
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
    }

    private filterKeyCode(event: any): void {
        const keyCode = event.keyCode;
        const check = this.filterStrategy.onkeydown || this.checkKeyCode;
        if (!check.call(this, keyCode)) {
            event.preventDefault();
        }
    }
}
