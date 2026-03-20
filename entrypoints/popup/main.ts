import { siteConfig, type SiteConfig } from "@/lib/storage";

const checkboxes = {
  tiktok: document.getElementById("tiktok") as HTMLInputElement,
  youtubeShorts: document.getElementById("youtubeShorts") as HTMLInputElement,
  instagramReels: document.getElementById("instagramReels") as HTMLInputElement,
};

const versionEl = document.getElementById("version")!;
const manifest = browser.runtime.getManifest();
versionEl.textContent = `v${manifest.version}`;

async function load(): Promise<void> {
  const config = await siteConfig.getValue();
  checkboxes.tiktok.checked = config.tiktok;
  checkboxes.youtubeShorts.checked = config.youtubeShorts;
  checkboxes.instagramReels.checked = config.instagramReels;
}

async function save(): Promise<void> {
  const config: SiteConfig = {
    tiktok: checkboxes.tiktok.checked,
    youtubeShorts: checkboxes.youtubeShorts.checked,
    instagramReels: checkboxes.instagramReels.checked,
  };
  await siteConfig.setValue(config);
}

load();

Object.values(checkboxes).forEach((cb) => {
  cb.addEventListener("change", save);
});
