import { z } from "zod";

export const AdminAttributesSchema = z.object({
  id: z.string(),
  userId: z.string(),
});

export interface IAdminAttributes
  extends z.infer<typeof AdminAttributesSchema> {}
