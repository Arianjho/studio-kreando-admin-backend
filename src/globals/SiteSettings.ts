import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "siteName", type: "text", required: true },
    { name: "siteUrl", type: "text", required: true },
    { name: "defaultSeoDescription", type: "textarea", required: true },
  ],
};
