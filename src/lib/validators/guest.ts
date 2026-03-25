import { z } from "zod";

export const addGuestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export const bulkGuestSchema = z.object({
  guests: z.array(addGuestSchema).min(1).max(500),
});

export type AddGuestInput = z.infer<typeof addGuestSchema>;
export type BulkGuestInput = z.infer<typeof bulkGuestSchema>;
