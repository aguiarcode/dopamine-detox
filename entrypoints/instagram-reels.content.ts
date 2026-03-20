import { siteConfig } from "@/lib/storage";
import { renderBlockedPage } from "@/lib/blocked-page";

const HIDE_REELS_UI_CSS = `
  a[href="/reels/"],
  a[href*="/reels/"] svg[aria-label="Reels"],
  a[href*="/reels/"]:has(svg) {
    display: none !important;
  }
`;

function isReelsPage(): boolean {
  return location.pathname.startsWith("/reels/");
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

  if (!isReelsPage()) {
    unhidePage();
    return;
  }

  if (config.enabled && config.instagramReels) {
    hidePageInstantly();
    renderBlockedPage("Instagram Reels");
  } else {
    unhidePage();
  }
}

function injectReelsUiHider(enabled: boolean): void {
  const id = "dopaminedetox-hide-reels-ui";
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!enabled) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = HIDE_REELS_UI_CSS;
  (document.head || document.documentElement).appendChild(style);
}

async function initUiHider(): Promise<void> {
  const config = await siteConfig.getValue();
  injectReelsUiHider(config.enabled && config.instagramReels);
  siteConfig.watch((c) => {
    injectReelsUiHider(c.enabled && c.instagramReels);
  });
}

export default defineContentScript({
  matches: ["*://www.instagram.com/*"],
  runAt: "document_start",
  main() {
    if (isReelsPage()) hidePageInstantly();

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
  },
});
