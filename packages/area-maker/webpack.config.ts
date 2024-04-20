/* global __dirname */

/* eslint-disable-next-line import/no-nodejs-modules */
import path from 'path';
import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';

const config = {
    entry: './src/app/index.tsx',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/u,
                exclude: /node_modules/u,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.html$/u,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src', 'app'),
        },
        extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/public/index.html',
            filename: './index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
    },
};

export default config;
