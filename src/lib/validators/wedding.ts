import { z } from "zod";

export const createWeddingSchema = z.object({
  groomName: z.string().min(1, "Groom name is required").max(100),
  brideName: z.string().min(1, "Bride name is required").max(100),
  groomFamily: z.string().max(200).optional(),
  brideFamily: z.string().max(200).optional(),
  eventDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Event date must be in the future",
  }),
  venue: z.string().min(1, "Venue is required").max(200),
  venueAddress: z.string().max(500).optional(),
  venueMapUrl: z.string().url().optional().or(z.literal("")),
  customMessage: z.string().max(2000).optional(),
  themeId: z.string().optional(),
});

export const updateWeddingSchema = createWeddingSchema.partial();

export const paymentDetailsSchema = z.object({
  paymentMethod: z.enum(["upi", "bank_transfer"]),
  upiId: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export type CreateWeddingInput = z.infer<typeof createWeddingSchema>;
export type UpdateWeddingInput = z.infer<typeof updateWeddingSchema>;
export type PaymentDetailsInput = z.infer<typeof paymentDetailsSchema>;
