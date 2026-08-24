import type { GlobalConfig } from "payload";

export const Contact: GlobalConfig = {
  slug: "contact",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "address", type: "textarea", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    { name: "hours", type: "textarea", required: true },
  ],
};
