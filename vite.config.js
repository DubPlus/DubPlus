import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import pkg from "./package.json";
import { resolve } from "path";

// only want to pass a few things from package, delete the rest
delete pkg.main;
delete pkg.scripts;
delete pkg.repository;
delete pkg.bugs;
delete pkg.devDependencies;
delete pkg.dependencies;
delete pkg.type;
delete pkg.browserslist;

// this is a fake dubs response to test the dubs module
const dubsResponse = {
  code: 200,
  message: "OK",
  data: {
    upDubs: [
      {
        _id: "abc123",
        type: "updub",
        created: 1719292218125,
        updated: 1719292218125,
        fkid: "abc123",
        model: "rooms_playlists",
        userid: "abc123",
        __v: 0,
      },
    ],
    downDubs: [],
    currentSong: {
      _id: "6669fae3f6962c00073f8620",
      created: 1718221537578,
      isActive: true,
      isPlayed: false,
      skipped: false,
      order: 5,
      roomid: "60553a02aa44080006989621",
      songLength: 446000,
      updubs: 6,
      downdubs: 0,
      userid: "605546871cc35c0006b1d08b",
      songid: "656f74824851430006005d0c",
      _user: "605546871cc35c0006b1d08b",
      _song: "656f74824851430006005d0c",
      __v: 0,
      played: 1719292219378,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [svelte()],
    define: {
      __TIME_STAMP__: JSON.stringify(Date.now().toString()),
      __SRC_ROOT__: JSON.stringify(
        "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus"
      ),
      __PKGINFO__: JSON.stringify(pkg),
    },
    build: {
      lib: {
        entry: resolve(__dirname, "/src/main.js"),
        name: "dubplus",
        fileName: "dubplus",
        formats: ["iife"],
      },
      copyPublicDir: false,
      rollupOptions: {
        output: {
          banner: BANNER,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") return "dubplus.min.css";
            return assetInfo.name;
          },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "main") return "dubplus.min.js";
            return chunkInfo.name;
          },
        },
      },
    },
    server: {
      proxy: {
        "/api/room/room-123/playlist/active/dubs": {
          target: "https://github.com",
          changeOrigin: true,
          selfHandleResponse: true,
          secure: false,
          configure(proxy) {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              var body = [];
              proxyRes.on("data", function (chunk) {
                body.push(chunk);
              });
              proxyRes.on("end", function () {
                body = Buffer.concat(body).toString();
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(dubsResponse));
              });
            });
          },
        },
      },
    },
  };
});

// this is a var instead of a const so I can leave it down here at the bottom of
// this file and JS will hoist it up and I can use it in the config above
var BANNER = `
/*!
     /#######            /##                
    | ##__  ##          | ##          /##   
    | ##  \\ ## /##   /##| #######    | ##   
    | ##  | ##| ##  | ##| ##__  ## /########
    | ##  | ##| ##  | ##| ##  \\ ##|__  ##__/
    | ##  | ##| ##  | ##| ##  | ##   | ##   
    | #######/|  ######/| #######/   |__/   
    |_______/  \______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    MIT License 

    Copyright (c) 2024 DubPlus

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/`;