const { z } = require("zod");

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long")
    .transform((val) => val.toLowerCase().trim()),
});

module.exports = { createTagSchema };
