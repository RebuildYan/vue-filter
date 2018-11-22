type KeycodeRange = {
    min: number;
    max: number;
};

export interface Strategy {
    legalReg: Array<RegExp>;
    illegalReg: Array<RegExp>;
    legalKeyCode: Array<number>;
    legalKeyCodeRange: Array<KeycodeRange>;
    illegalKeyCode: Array<number>;
    illegalKeyCodeRange: Array<KeycodeRange>;
    oninput?: Function;
    onkeydown?: Function;
}

export interface StrategyOption {
    legalReg?: Array<RegExp>;
    illegalReg?: Array<RegExp>;
    legalKeyCode?: Array<number>;
    legalKeyCodeRange?: Array<KeycodeRange>;
    illegalKeyCode?: Array<number>;
    illegalKeyCodeRange?: Array<KeycodeRange>;
    oninput?: Function;
    onkeydown?: Function;
}

export interface StrategyMap {
    [key: string]: StrategyOption;
}

const letter: StrategyOption = {
    legalReg: [/^[a-zA-Z]{1,}$/],
    legalKeyCodeRange: [
        {
            min: 65,
            max: 90,
        },
    ],
};

const number: StrategyOption = {
    legalReg: [/^[0-9]{1,}$/],
    legalKeyCodeRange: [
        {
            min: 48,
            max: 57,
        },
        {
            min: 96,
            max: 105,
        }
    ],
};

const decimal: StrategyOption = {
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

const strategies: StrategyMap = {
    letter,
    number,
    decimal,
};

export default strategies;
