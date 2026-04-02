const { z } = require("zod");

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().max(10000, "Content too long").optional(),
  pinned: z.boolean().optional().default(false),
  collectionId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).optional().default([]),
});

const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  content: z.string().max(10000, "Content too long").optional().nullable(),
  pinned: z.boolean().optional(),
  collectionId: z.string().cuid().optional().nullable(),
  tagIds: z.array(z.string().cuid()).optional(),
});

module.exports = { createNoteSchema, updateNoteSchema };
