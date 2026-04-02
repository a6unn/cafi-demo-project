/**
 * Express middleware that validates request body against a Zod schema.
 * Usage: router.post("/", validate(createNoteSchema), handler)
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err); // Passes to errorHandler which formats ZodError
    }
  };
}

module.exports = { validate };
