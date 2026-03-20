import { siteConfig, type SiteConfig } from "@/lib/storage";

const enabledCb = document.getElementById("enabled") as HTMLInputElement;
const sitesDiv = document.getElementById("sites")!;

const checkboxes = {
  tiktok: document.getElementById("tiktok") as HTMLInputElement,
  youtubeShorts: document.getElementById("youtubeShorts") as HTMLInputElement,
  instagramReels: document.getElementById("instagramReels") as HTMLInputElement,
};

const versionEl = document.getElementById("version")!;
const manifest = browser.runtime.getManifest();
versionEl.textContent = `v${manifest.version}`;

function updateSitesState(enabled: boolean): void {
  sitesDiv.classList.toggle("disabled", !enabled);
}

async function load(): Promise<void> {
  const config = await siteConfig.getValue();
  enabledCb.checked = config.enabled;
  checkboxes.tiktok.checked = config.tiktok;
  checkboxes.youtubeShorts.checked = config.youtubeShorts;
  checkboxes.instagramReels.checked = config.instagramReels;
  updateSitesState(config.enabled);
}

async function save(): Promise<void> {
  const config: SiteConfig = {
    enabled: enabledCb.checked,
    tiktok: checkboxes.tiktok.checked,
    youtubeShorts: checkboxes.youtubeShorts.checked,
    instagramReels: checkboxes.instagramReels.checked,
  };
  await siteConfig.setValue(config);
  updateSitesState(config.enabled);
}

load();

enabledCb.addEventListener("change", save);
Object.values(checkboxes).forEach((cb) => {
  cb.addEventListener("change", save);
});
