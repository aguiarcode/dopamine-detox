import { siteConfig } from "@/lib/storage";
import { renderBlockedPage } from "@/lib/blocked-page";

function isReelsPage(): boolean {
  return location.pathname.startsWith("/reels/");
}

async function check(): Promise<void> {
  if (!isReelsPage()) return;
  const config = await siteConfig.getValue();
  if (config.enabled && config.instagramReels) renderBlockedPage("Instagram Reels");
}

export default defineContentScript({
  matches: ["*://www.instagram.com/*"],
  runAt: "document_start",
  main() {
    check();

    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      originalPushState(...args);
      check();
    };
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      check();
    };

    window.addEventListener("popstate", () => check());
  },
});
