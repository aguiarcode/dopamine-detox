import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: "dopaminedetox",
    description: "Block TikTok, YouTube Shorts, and Instagram Reels",
    version: "0.1.0",
    permissions: ["declarativeNetRequest"],
    declarative_net_request: {
      rule_resources: [
        {
          id: "block_rules",
          enabled: true,
          path: "rules.json",
        },
      ],
    },
  },
});
