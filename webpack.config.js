const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlWebPackPlugin()
    ],
    resolve: {
        modules: [
            '.',
            './node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    devServer: {
        compress: true,
        port: 9000,
        historyApiFallback: true
    }
}