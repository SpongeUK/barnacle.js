const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/ScormDriver.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'Barnacle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Barnacle',
        libraryTarget: "var"
    }
};