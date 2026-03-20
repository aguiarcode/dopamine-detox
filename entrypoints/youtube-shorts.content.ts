import { siteConfig } from "@/lib/storage";
import { renderBlockedPage } from "@/lib/blocked-page";

const HIDE_SHORTS_UI_CSS = `
  ytd-mini-guide-entry-renderer a[title="Shorts"],
  ytd-guide-entry-renderer a[title="Shorts"],
  ytd-mini-guide-entry-renderer a[href="/shorts"],
  ytd-guide-entry-renderer a[href="/shorts"],
  ytd-rich-shelf-renderer[is-shorts],
  ytd-reel-shelf-renderer,
  ytd-shorts-shelf-renderer,
  ytd-grid-video-renderer [href*="/shorts/"],
  ytd-video-renderer [href*="/shorts/"],
  ytd-rich-item-renderer:has(a[href*="/shorts/"]) {
    display: none !important;
  }
`;

function isShortsPage(): boolean {
  return location.pathname.startsWith("/shorts/");
}

let hideStyle: HTMLStyleElement | null = null;

function hidePageInstantly(): void {
  if (hideStyle) return;
  hideStyle = document.createElement("style");
  hideStyle.textContent = "html { display: none !important; }";
  (document.head || document.documentElement).appendChild(hideStyle);
}

function unhidePage(): void {
  if (hideStyle) {
    hideStyle.remove();
    hideStyle = null;
  }
}

async function check(): Promise<void> {
  const config = await siteConfig.getValue();

  if (!isShortsPage()) {
    unhidePage();
    return;
  }

  if (config.enabled && config.youtubeShorts) {
    hidePageInstantly();
    renderBlockedPage("YouTube Shorts");
  } else {
    unhidePage();
  }
}

function injectShortsUiHider(enabled: boolean): void {
  const id = "dopaminedetox-hide-shorts-ui";
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!enabled) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = HIDE_SHORTS_UI_CSS;
  (document.head || document.documentElement).appendChild(style);
}

async function initUiHider(): Promise<void> {
  const config = await siteConfig.getValue();
  injectShortsUiHider(config.enabled && config.youtubeShorts);
  siteConfig.watch((c) => {
    injectShortsUiHider(c.enabled && c.youtubeShorts);
  });
}

export default defineContentScript({
  matches: ["*://www.youtube.com/*"],
  runAt: "document_start",
  main() {
    if (isShortsPage()) hidePageInstantly();

    check();
    initUiHider();

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
