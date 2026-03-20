import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: "dopaminedetox",
    description: "Block TikTok, YouTube Shorts, and Instagram Reels",
    version: "0.1.0",
    permissions: ["declarativeNetRequest", "storage"],
    host_permissions: [
      "*://*.tiktok.com/*",
      "*://www.youtube.com/*",
      "*://www.instagram.com/*",
    ],
  },
});
