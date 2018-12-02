const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            query: {compact: false}
        },
        {
            test: /\.css$/,
            use: [{
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                }
            ]
        },
        {
            test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [{
                loader: 'file-loader'
            }]
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader'
            }]
        }]
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map ',
    devServer: {
        contentBase: path.join(__dirname,'public'),
        historyApiFallback: true,
        port: 8080
    },
}; 