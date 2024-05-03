import { z } from "zod";

import { UserAttributesSchema } from "~/modules/user/domain/interface/user";
import { CustomerAttributesSchema } from "~/modules/customer/domain/interface/customer";

export const CreateUserDTOSchema = UserAttributesSchema.pick({
  email: true,
  phone: true,
  password: true,
  credentialUuid: true,
}).merge(
  CustomerAttributesSchema.pick({
    name: true,
    notes: true,
  })
);

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>;
