import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";
import fs from "fs";
const { version } = require("./package.json");
//import { version } from "./package.json";

// .git 디렉토리가 client root 밑이라서 라이버르리를 그대로 쓰지 못함.
// 그래서 코드 복붇
// copied from
// https://gitlab.com/IvanSanchez/rollup-plugin-git-version/-/blob/master/src/version.mjs
//
// "THE BEER-WARE LICENSE":
// ivan@sanchezortega.es wrote this file. As long as you retain this notice you
// can do whatever you want with this stuff. If we meet some day, and you think
// this stuff is worth it, you can buy me a beer in return.  const branchRegexp = /ref: .*\/(\w*)/;
function parseGitCommit() {
  const branchRegexp = /ref: (.*)/;
  const data1 = fs.readFileSync("../.git/HEAD");
  const branch = branchRegexp.exec(data1)[1];

  const revision = require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .substring(0,6)
    .trim();
  return `${revision}-${branch}`;
}

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    replace({
      "process.env.BUILD_ENV": production ? '"production"' : '"dev"',
      "process.env.VERSION": `"${version}-${parseGitCommit()}"`,
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
