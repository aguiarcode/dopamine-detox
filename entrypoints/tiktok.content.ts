import { siteConfig } from "@/lib/storage";
import { renderBlockedPage } from "@/lib/blocked-page";

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
  if (config.enabled && config.tiktok) {
    hidePageInstantly();
    renderBlockedPage("TikTok");
  } else {
    unhidePage();
  }
}

export default defineContentScript({
  matches: ["*://*.tiktok.com/*"],
  runAt: "document_start",
  main() {
    hidePageInstantly();
    check();
  },
});
