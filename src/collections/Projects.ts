import type { CollectionConfig } from "payload";
import { triggerRevalidate } from "../utilities/triggerRevalidate";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "year", "status", "featured"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [async () => { await triggerRevalidate("projects"); }],
    afterDelete: [async () => { await triggerRevalidate("projects"); }],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL del proyecto, ej. casa-adobe" },
    },
    { name: "name", type: "text", required: true },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    { name: "year", type: "number", required: true },
    { name: "location", type: "text", required: true },
    { name: "area", type: "text", required: true },
    { name: "program", type: "text", required: true },
    { name: "team", type: "text", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Construido", value: "Construido" },
        { label: "En obra", value: "En obra" },
        { label: "En proyecto", value: "En proyecto" },
      ],
    },
    { name: "intro", type: "textarea", required: true },
    { name: "body", type: "richText", required: true },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    { name: "coverAlt", type: "text", required: true },
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "alt", type: "text", required: true },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Aparece en la portada" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Menor número aparece primero en los listados" },
    },
  ],
};
