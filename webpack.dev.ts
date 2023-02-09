import path from "path";
import nodeExternals from "webpack-node-externals";
import { Configuration } from "webpack";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import CopyPlugin from "copy-webpack-plugin";

const getConfig = (
    argv: { [key: string]: string }
): Configuration => {
    return {
        entry: {
          "./server/index": "./src/server/index.ts", 
          "./front/script": "./src/front/script.ts"},
        target: "node",
        mode: argv.mode === "production" ? "production" : "development",
        externals: [nodeExternals()],
        devtool: 'source-map',
        plugins: [
            new WebpackShellPluginNext({
                onBuildStart: {
                    scripts: ["npm run clean:dev"],
                    blocking: true,
                    parallel: false,
                },
                onBuildEnd: {
                    scripts: ["npm run dev"],
                    blocking: false,
                    parallel: true,
                },
            }),
            new CopyPlugin({
                patterns: [
                    {
                      from: "./src/server/assets",
                      to: "server/assets",
                    },
                    {
                      from: "./src/front",
                      to: "front",
                      globOptions: {
                        ignore: [
                          "**/*.ts",
                        ],
                      },
                    },
                ]
            })
        ],
        module: {
            rules: [{
                test: /\.(ts|js)$/,
                loader: "ts-loader",
                options: {},
                exclude: /node_modules/,
            }]
        },
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                src: path.resolve(__dirname, "server"),
            }
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "[name].js",
        },
        optimization: {
            moduleIds: "deterministic",
            splitChunks: {
                chunks: "all",
            }
        }
    }
}

export default getConfig;
