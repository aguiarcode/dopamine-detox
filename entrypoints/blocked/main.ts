const SITE_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  youtubeShorts: "YouTube Shorts",
  instagramReels: "Instagram Reels",
};

const params = new URLSearchParams(window.location.search);
const site = params.get("site") ?? "";
const el = document.getElementById("siteName")!;
el.textContent = SITE_LABELS[site] ?? "";
