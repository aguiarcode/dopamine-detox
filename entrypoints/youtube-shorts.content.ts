import { siteConfig } from "@/lib/storage";
import { renderBlockedPage } from "@/lib/blocked-page";

function isShortsPage(): boolean {
  return location.pathname.startsWith("/shorts/");
}

async function check(): Promise<void> {
  if (!isShortsPage()) return;
  const config = await siteConfig.getValue();
  if (config.enabled && config.youtubeShorts) renderBlockedPage("YouTube Shorts");
}

export default defineContentScript({
  matches: ["*://www.youtube.com/*"],
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
    window.addEventListener("yt-navigate-finish", () => check());
  },
});
