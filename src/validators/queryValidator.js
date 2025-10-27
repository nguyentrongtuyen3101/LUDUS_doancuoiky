import { z } from "zod";

export const paginationSchema = z
  .object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional(),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    q: z.string().optional(),
    status: z.string().optional(),
    filter: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    id: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
  })
  .transform((data) => {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const offset = data.offset ?? (page - 1) * limit;
    return { ...data, page, limit, offset };
  });

export const validateQuery = (schema) => (req, res, next) => {
  console.log("🟦 Raw query:", req.query);
  try {
    const parsed = schema.parse(req.query); 
    console.log("🟩 Parsed query:", parsed);
    req.validatedQuery = parsed;
    next();
  } catch (error) {
    console.error("❌ ZOD ERROR:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: error.errors || error.message,
    });
  }
};
