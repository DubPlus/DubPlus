import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

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
export default defineConfig({
  plugins: [svelte()],
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
});
