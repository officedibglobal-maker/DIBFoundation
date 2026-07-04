
import { z } from "zod";

export const TeamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  role: z.string().min(3, "Role must be at least 3 characters long"),
  image: z.string().url("Image must be a valid URL"),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;
