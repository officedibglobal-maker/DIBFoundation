
import { z } from "zod";

export const FocusAreaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  icon: z.string().min(1, "Icon is required"),
});

export type FocusArea = z.infer<typeof FocusAreaSchema>;
