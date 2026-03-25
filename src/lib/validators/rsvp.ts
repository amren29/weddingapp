import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  rsvpStatus: z.enum(["ACCEPTED", "DECLINED", "MAYBE"]),
  plusOnes: z.number().min(0).max(10).default(0),
  dietaryNotes: z.string().max(500).optional(),
});

export const messageSchema = z.object({
  guestName: z.string().min(1, "Name is required").max(100),
  content: z.string().min(1, "Message is required").max(1000),
});

export const giftClaimSchema = z.object({
  giftId: z.string().uuid(),
  claimedBy: z.string().min(1, "Name is required").max(100),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type GiftClaimInput = z.infer<typeof giftClaimSchema>;
