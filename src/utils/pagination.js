/**
 * Build cursor-based pagination parameters for Prisma queries.
 *
 * Usage:
 *   const pagination = buildPagination(req.query);
 *   const items = await prisma.note.findMany({ ...pagination, where: { ... } });
 *   const response = buildPaginationResponse(items, req.query.limit);
 */

function buildPagination(query) {
  const limit = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);
  const result = {
    take: limit + 1, // Take one extra to determine if there's a next page
    orderBy: { createdAt: "desc" },
  };

  if (query.cursor) {
    result.cursor = { id: query.cursor };
    result.skip = 1; // Skip the cursor item itself
  }

  return result;
}

function buildPaginationResponse(items, requestedLimit) {
  const limit = Math.min(Math.max(parseInt(requestedLimit) || 20, 1), 100);
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return {
    data,
    pagination: {
      hasMore,
      nextCursor,
      count: data.length,
    },
  };
}

module.exports = { buildPagination, buildPaginationResponse };
