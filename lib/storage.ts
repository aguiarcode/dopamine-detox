import { storage } from "@wxt-dev/storage";

export interface SiteConfig {
  tiktok: boolean;
  youtubeShorts: boolean;
  instagramReels: boolean;
}

const DEFAULTS: SiteConfig = {
  tiktok: true,
  youtubeShorts: true,
  instagramReels: true,
};

export const siteConfig = storage.defineItem<SiteConfig>("local:siteConfig", {
  fallback: DEFAULTS,
});
