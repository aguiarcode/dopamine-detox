import { siteConfig } from "@/lib/storage";
import { applyRules } from "@/lib/rules";

export default defineBackground(() => {
  siteConfig.getValue().then((config) => {
    applyRules(config);
  });

  siteConfig.watch((config) => {
    applyRules(config);
  });
});
