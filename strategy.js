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
    }
};
