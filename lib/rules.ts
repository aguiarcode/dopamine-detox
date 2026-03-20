import type { SiteConfig } from "./storage";

type Rule = browser.declarativeNetRequest.Rule;

function redirectAction(site: string): Rule["action"] {
  return {
    type: "redirect",
    redirect: {
      extensionPath: `/blocked.html?site=${site}`,
    },
  };
}

const TIKTOK_RULE: Rule = {
  id: 1,
  priority: 1,
  action: redirectAction("tiktok"),
  condition: {
    requestDomains: ["tiktok.com"],
    resourceTypes: ["main_frame", "sub_frame"],
  },
};

const YOUTUBE_SHORTS_RULE: Rule = {
  id: 2,
  priority: 1,
  action: redirectAction("youtubeShorts"),
  condition: {
    urlFilter: "||www.youtube.com/shorts/*",
    resourceTypes: ["main_frame", "sub_frame"],
  },
};

const INSTAGRAM_REELS_RULE: Rule = {
  id: 3,
  priority: 1,
  action: redirectAction("instagramReels"),
  condition: {
    urlFilter: "||www.instagram.com/reels/*",
    resourceTypes: ["main_frame", "sub_frame"],
  },
};

const ALL_RULE_IDS = [1, 2, 3];

export function buildRules(config: SiteConfig): Rule[] {
  if (!config.enabled) return [];
  const rules: Rule[] = [];
  if (config.tiktok) rules.push(TIKTOK_RULE);
  if (config.youtubeShorts) rules.push(YOUTUBE_SHORTS_RULE);
  if (config.instagramReels) rules.push(INSTAGRAM_REELS_RULE);
  return rules;
}

export async function applyRules(config: SiteConfig): Promise<void> {
  const newRules = buildRules(config);
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ALL_RULE_IDS,
    addRules: newRules,
  });
}
