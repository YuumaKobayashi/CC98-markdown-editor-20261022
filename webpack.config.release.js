"use strict";
exports.__esModule = true;

const webpack = require("webpack");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const { themeEntries } = require("./build/theme-manifest.cjs");
const { createWebpackTemplateParameters } = require("./build/template-contract.cjs");
const fs = require("fs/promises");
const { minify } = require("html-minifier-terser");
const minifyOptions = {
  collapseWhitespace: true,
  minifyJS: true,
};
const config = (async () => {
  const errorTemplate = await minify(
    (await fs.readFile("error.html")).toString(),
    minifyOptions
  );
  const unsupportedTemplate = await minify(
    (await fs.readFile("unsupported.html")).toString(),
    minifyOptions
  );

  return {
  // webpack 4 only
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true,
              },
            },
            "sass-loader",
          ],
        }),
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  entry: {
    main: "./Main.tsx",
    ...themeEntries,
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "static/scripts/[name]-[chunkhash:8].js",
  },
  devtool: false,
  externals: {
    jquery: "$",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "Template.ejs",
      filename: "static/index.html",
      minify: minifyOptions,
      inject: false,
      templateParameters: (_compilation, assets) =>
        createWebpackTemplateParameters({
          assets,
          errorTemplate,
          unsupportedTemplate,
        }),
    }),
    // clean the complete build output so removed public assets cannot remain stale
    new CleanWebpackPlugin(["dist"], { root: __dirname }),
    new CopyWebpackPlugin([
      { from: "public/static", to: "static" },
      { from: "deploy/iis/web.config", to: "web.config" },
      { from: "node_modules/jquery/dist", to: "static/scripts/lib/jquery/" },
      { from: "node_modules/moment", to: "static/scripts/lib/moment/" },
      { from: "node_modules/bootstrap/dist", to: "static/scripts/lib/bootstrap/" },
      { from: "node_modules/bootstrap-icons", to: "static/scripts/lib/bootstrap-icons/" },
      { from: "node_modules/frowser/build", to: "static/scripts/lib/frowser/" },
      { from: "node_modules/font-awesome", to: "static/content/font-awesome/" },
      { from: "node_modules/mathjax-full", to: "static/scripts/lib/mathjax-full" },
      {
        from: "node_modules/spectrum-colorpicker/spectrum.js",
        to: "static/scripts/lib/spectrum/spectrum.js",
      },
      {
        from: "node_modules/dplayer/dist/DPlayer.min.css",
        to: "static/content/DPlayer.min.css",
      },
      {
        from: "node_modules/dplayer/dist/DPlayer.min.css.map",
        to: "static/content/DPlayer.min.css.map",
      },
      {
        from: "node_modules/aplayer/dist/APlayer.min.css",
        to: "static/content/APlayer.min.css",
      },
      {
        from: "node_modules/aplayer/dist/APlayer.min.css.map",
        to: "static/content/APlayer.min.css.map",
      },
      {
        from: "node_modules/hls.js/dist/hls.min.js",
        to: "static/content/hls.min.js",
      },
      {
        from: "reset.html",
        to: "static/reset.html",
      },
    ]),
    new ExtractTextPlugin("static/content/[name]-[chunkhash:8].css"),
    new WebpackChunkHash({ algorithm: "md5" }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"],
          },
          safari10: true,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  };
})();
exports["default"] = config;
