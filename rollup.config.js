import * as typescript from 'typescript';
import TS from 'rollup-plugin-typescript';

export default [
    {
        input: './src/index.ts',
        output: {
            file: './_build/index.js',
            format: 'cjs'
        },
        plugins: [
            TS({
                typescript,
            }),
        ],
    },
];
