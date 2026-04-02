const express = require("express");
const prisma = require("../utils/prisma");
const { validate } = require("../middleware/validate");
const { createCollectionSchema, updateCollectionSchema } = require("../schemas/collections");
const { buildPagination, buildPaginationResponse } = require("../utils/pagination");

const router = express.Router();

// GET /api/collections — List collections with cursor-based pagination
router.get("/", async (req, res, next) => {
  try {
    const pagination = buildPagination(req.query);

    const collections = await prisma.collection.findMany({
      ...pagination,
      include: {
        _count: { select: { notes: true } },
      },
    });

    res.json(buildPaginationResponse(collections, req.query.limit));
  } catch (err) {
    next(err);
  }
});

// GET /api/collections/:id — Get a single collection with its notes
router.get("/:id", async (req, res, next) => {
  try {
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { notes: true } },
      },
    });

    res.json(collection);
  } catch (err) {
    next(err);
  }
});

// POST /api/collections — Create a new collection
router.post("/", validate(createCollectionSchema), async (req, res, next) => {
  try {
    const collection = await prisma.collection.create({
      data: req.body,
      include: { _count: { select: { notes: true } } },
    });

    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/collections/:id — Update a collection
router.patch("/:id", validate(updateCollectionSchema), async (req, res, next) => {
  try {
    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: req.body,
      include: { _count: { select: { notes: true } } },
    });

    res.json(collection);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/collections/:id — Delete a collection (notes become uncategorized)
router.delete("/:id", async (req, res, next) => {
  try {
    // Unlink notes before deleting collection
    await prisma.note.updateMany({
      where: { collectionId: req.params.id },
      data: { collectionId: null },
    });

    await prisma.collection.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
