import type { GlobalConfig } from "payload";
import { triggerRevalidate } from "../utilities/triggerRevalidate";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [async () => { await triggerRevalidate("site-settings"); }],
  },
  fields: [
    { name: "siteName", type: "text", required: true },
    { name: "siteUrl", type: "text", required: true },
    { name: "defaultSeoDescription", type: "textarea", required: true },
  ],
};
