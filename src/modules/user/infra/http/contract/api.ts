import { z } from "zod";

import { UserAttributesSchema } from "~/modules/user/domain/interface/user";

export const GetAllResponseSchema = z.object({
  users: z.array(
    UserAttributesSchema.pick({
      id: true,
      email: true,
      phone: true,
    }),
  ),
});
export type GetAllResponse = z.infer<typeof GetAllResponseSchema>;
