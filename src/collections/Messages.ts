import type { CollectionConfig } from "payload";

export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "read", "createdAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "subject", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    { name: "read", type: "checkbox", defaultValue: false },
  ],
};
