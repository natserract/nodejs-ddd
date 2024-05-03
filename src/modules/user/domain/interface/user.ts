import { z } from "zod";

export const UserAttributesSchema = z.object({
  id: z.string().uuid(),
  password: z
    .string()
    .min(6, { message: "Password must be 6 or more characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Not a valid email"),
  phone: z.string().nullish(),
});

export interface IUserAttributes extends z.infer<typeof UserAttributesSchema> {}

export enum UserTypes {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
