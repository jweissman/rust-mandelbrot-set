const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dist = path.resolve(__dirname, "dist");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const appConfig = {
  entry: "./app/main.ts",
  devServer: { contentBase: dist },
  plugins: [
    new HtmlWebpackPlugin({ template: "index.html", root: path.resolve(__dirname, '.') }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: 'css/' } },
          "css-loader"
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        use: [{ loader: 'file-loader?name=./static/[name].[ext]' }],
      },
      {
        test: /\.(webmanifest|xml)$/i,
        use: [{ loader: 'file-loader?name=./[name].[ext]' }],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: { path: dist, filename: "app.js" }
};

const workerConfig = {
  entry: "./worker/worker.js",
  target: "webworker",
  plugins: [new WasmPackPlugin({ crateDirectory: path.resolve(__dirname, "../crate-wasm") })],
  resolve: { extensions: [".js", ".wasm"] },
  output: { path: dist, filename: "worker.js" },
  //[DDR 2020-11-20] asyncWebAssembly is broken by webpack 5. (See https://github.com/rustwasm/wasm-bindgen/issues/2343)
  experiments: { syncWebAssembly: true }
};

module.exports = [appConfig, workerConfig];
