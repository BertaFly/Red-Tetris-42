/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "./src/client/index.html"),
  filename: "./index.html"
});

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "./src/client/index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [htmlWebpackPlugin],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(mp3|otf|jpg|ttf|png|svg)/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: { "@src": path.join(__dirname, "src") },
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  devServer: {
    port: 3001
  }
};
