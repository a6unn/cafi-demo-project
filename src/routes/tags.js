const express = require("express");
const prisma = require("../utils/prisma");
const { validate } = require("../middleware/validate");
const { createTagSchema } = require("../schemas/tags");

const router = express.Router();

// GET /api/tags — List all tags with usage count
router.get("/", async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { notes: true } },
      },
    });

    res.json({ data: tags });
  } catch (err) {
    next(err);
  }
});

// POST /api/tags — Create a new tag
router.post("/", validate(createTagSchema), async (req, res, next) => {
  try {
    const tag = await prisma.tag.create({
      data: req.body,
      include: { _count: { select: { notes: true } } },
    });

    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tags/:id — Delete a tag
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.tag.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
