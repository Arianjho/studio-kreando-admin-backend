import type { GlobalConfig } from "payload";
import { triggerRevalidate } from "../utilities/triggerRevalidate";

export const About: GlobalConfig = {
  slug: "about",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [async () => { await triggerRevalidate("about"); }],
  },
  fields: [
    { name: "heroImage", type: "upload", relationTo: "media", required: true },
    { name: "heroHeadline", type: "text", required: true },
    { name: "heroSubtext", type: "textarea", required: true },
    {
      name: "introParagraphs",
      type: "array",
      minRows: 1,
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "services",
      type: "array",
      minRows: 1,
      fields: [
        { name: "number", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
      ],
    },
    {
      name: "milestones",
      type: "array",
      minRows: 1,
      fields: [
        { name: "year", type: "text", required: true },
        { name: "text", type: "text", required: true },
      ],
    },
    { name: "detailImage", type: "upload", relationTo: "media", required: true },
    { name: "ctaLabel", type: "text", required: true },
  ],
};
