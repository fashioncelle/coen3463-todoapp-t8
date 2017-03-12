var path = require('path');

process.noDeprecation = true;

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, '/public/build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['latest', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};