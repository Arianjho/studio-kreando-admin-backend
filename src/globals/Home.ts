import type { GlobalConfig } from "payload";
import { triggerRevalidate } from "../utilities/triggerRevalidate";

export const Home: GlobalConfig = {
  slug: "home",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [async () => { await triggerRevalidate("home"); }],
  },
  fields: [
    { name: "heroHeadline", type: "text", required: true },
    { name: "heroSubtext", type: "textarea", required: true },
    { name: "heroImage", type: "upload", relationTo: "media", required: true },
    { name: "heroCtaPrimaryLabel", type: "text", required: true },
    { name: "heroCtaSecondaryLabel", type: "text", required: true },
    { name: "aboutHeading", type: "text", required: true },
    { name: "aboutText", type: "textarea", required: true },
    { name: "aboutCtaLabel", type: "text", required: true },
    {
      name: "stats",
      type: "array",
      minRows: 1,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "services",
      type: "array",
      minRows: 1,
      fields: [
        { name: "number", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "credits",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "portfolioHeading", type: "text", required: true },
    { name: "portfolioText", type: "textarea", required: true },
    { name: "ctaHeading", type: "text", required: true },
    { name: "ctaText", type: "textarea", required: true },
    { name: "ctaButtonLabel", type: "text", required: true },
  ],
};
