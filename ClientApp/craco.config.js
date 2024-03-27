// CRACO (Create React App Configuration Override) is an easy and comprehensible configuration layer for create-react-app.
// https://github.com/gsoft-inc/craco

const webpack = require("webpack");
const path = require("path");

module.exports = {
  babel: {
    plugins: [
      [
        "babel-plugin-direct-import",
        {
          modules: [
            "@mui/lab",
            "@mui/material",
            "@mui/system",
            "@mui/icons-material",
            "react-feather",
          ],
        },
      ],
    ],
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Set the alias for the .env file based on environment
      if (env === "production") {
        webpackConfig.resolve.alias["dotenv"] = path.resolve("/var/opt/.env");
      } else {
        webpackConfig.resolve.alias["dotenv"] = path.resolve(__dirname, ".env");
      }

      // Webpack ≥5 no longer ships with Node.js polyfills by default.
      // Reference: https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed
      // Solution: https://github.com/facebook/create-react-app/issues/11756#issuecomment-1001769356

      webpackConfig.resolve.fallback = {
        buffer: require.resolve("buffer"),
        crypto: require.resolve("crypto-browserify"),
        process: require.resolve("process/browser"),
        "process/browser": require.resolve("process/browser"),
        "vm": require.resolve("vm-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
      };

      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );

      return webpackConfig;
    },
  },
};
