export default {
    letter: {
        legalReg: [/^[a-zA-Z]{1,}$/],
        legalKeyCodeRange: [
            {
                min: 65,
                max: 90
            }
        ]
    },
    number: {
        legalReg: [/^[0-9]{1,}$/],
        legalKeyCodeRange: [
            {
                min: 48,
                max: 57
            },
            {
                min: 96,
                max: 105
            }
        ]
    },
    decimal: {
        legalReg: [/[0-9.]{1,}$/],
        legalKeyCode: [8, 32, 37, 38, 39, 40, 46, 190],
        legalKeyCodeRange: [
            {
                min: 48,
                max: 57
            },
            {
                min: 96,
                max: 105
            }
        ]
    }
};
