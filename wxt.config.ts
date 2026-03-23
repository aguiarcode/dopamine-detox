import { defineConfig } from "wxt";

export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: "Dopamine Detox",
    description: "Block TikTok, YouTube Shorts, and Instagram Reels",
    version: "0.1.0",
    permissions: ["declarativeNetRequest", "storage"],
    browser_specific_settings: {
      gecko: {
        id: "dopamine-detox@aguiarcode",
      },
    },
  },
  hooks: {
    "build:manifestGenerated": (_wxt, manifest) => {
      const gecko = (manifest as any).browser_specific_settings?.gecko;
      if (gecko) {
        gecko.data_collection_permissions = {
          private_browsing: "neither",
          data_collection: "neither",
          required: ["none"],
        };
      }
    },
  },
});
