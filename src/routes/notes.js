const express = require("express");
const prisma = require("../utils/prisma");
const { validate } = require("../middleware/validate");
const { createNoteSchema, updateNoteSchema } = require("../schemas/notes");
const { buildPagination, buildPaginationResponse } = require("../utils/pagination");

const router = express.Router();

// GET /api/notes — List notes with cursor-based pagination
router.get("/", async (req, res, next) => {
  try {
    const pagination = buildPagination(req.query);
    const where = {};

    // Optional filters
    if (req.query.collectionId) {
      where.collectionId = req.query.collectionId;
    }
    if (req.query.pinned === "true") {
      where.pinned = true;
    }
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search } },
        { content: { contains: req.query.search } },
      ];
    }

    const notes = await prisma.note.findMany({
      ...pagination,
      where,
      include: {
        collection: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: true } },
      },
    });

    // Transform tags from join table format to flat array
    const transformed = notes.map((note) => ({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    }));

    res.json(buildPaginationResponse(transformed, req.query.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/notes/:id — Get a single note
router.get("/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        collection: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: true } },
      },
    });

    res.json({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/notes — Create a new note
router.post("/", validate(createNoteSchema), async (req, res, next) => {
  try {
    const { tagIds, ...data } = req.body;

    const note = await prisma.note.create({
      data: {
        ...data,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: {
        collection: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notes/:id — Update a note
router.patch("/:id", validate(updateNoteSchema), async (req, res, next) => {
  try {
    const { tagIds, ...data } = req.body;

    // If tagIds provided, replace all tag associations
    if (tagIds !== undefined) {
      await prisma.noteTag.deleteMany({ where: { noteId: req.params.id } });
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(tagIds && {
          tags: { create: tagIds.map((tagId) => ({ tagId })) },
        }),
      },
      include: {
        collection: { select: { id: true, name: true, color: true } },
        tags: { include: { tag: true } },
      },
    });

    res.json({
      ...note,
      tags: note.tags.map((nt) => nt.tag),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id — Delete a note
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
