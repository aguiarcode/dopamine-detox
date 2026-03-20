import { siteConfig } from "@/lib/storage";

const BLOCKED_HTML = `
<div style="display:flex;align-items:center;justify-content:center;height:100vh;
  background:#000;color:#fff;font-family:system-ui,sans-serif;text-align:center">
  <div>
    <h1 style="font-size:2rem;margin-bottom:0.5rem">dopaminedetox</h1>
    <p style="font-size:1.2rem;opacity:0.7">YouTube Shorts is blocked.</p>
  </div>
</div>`;

function isShortsPage(): boolean {
  return location.pathname.startsWith("/shorts/");
}

function blockPage(): void {
  document.documentElement.innerHTML = BLOCKED_HTML;
}

async function check(): Promise<void> {
  if (!isShortsPage()) return;
  const config = await siteConfig.getValue();
  if (config.youtubeShorts) blockPage();
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
