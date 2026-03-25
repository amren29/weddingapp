export type Plan = "FREE" | "PREMIUM";
export type WeddingStatus = "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
export type RsvpStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "MAYBE";
export type GiftStatus = "AVAILABLE" | "CLAIMED" | "PURCHASED";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wedding {
  id: string;
  slug: string;
  userId: string;
  groomName: string;
  brideName: string;
  groomFamily: string | null;
  brideFamily: string | null;
  eventDate: Date;
  venue: string;
  venueAddress: string | null;
  venueMapUrl: string | null;
  themeId: string | null;
  themeConfig: ThemeConfig | null;
  cardImageUrl: string | null;
  customMessage: string | null;
  paymentMethod: string | null;
  paymentDetails: PaymentDetails | null;
  status: WeddingStatus;
  expiresAt: Date | null;
  exportedAt: Date | null;
  exportUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  weddingId: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: RsvpStatus;
  plusOnes: number;
  dietaryNotes: string | null;
  respondedAt: Date | null;
  createdAt: Date;
}

export interface Message {
  id: string;
  weddingId: string;
  guestName: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface VoiceNote {
  id: string;
  weddingId: string;
  guestName: string;
  fileUrl: string;
  duration: number;
  isApproved: boolean;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  weddingId: string;
  uploadedBy: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  isApproved: boolean;
  createdAt: Date;
}

export interface Gift {
  id: string;
  weddingId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  link: string | null;
  price: number | null;
  claimedBy: string | null;
  claimedAt: Date | null;
  status: GiftStatus;
  createdAt: Date;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: "classic" | "modern" | "minimal" | "ornate";
  backgroundImage?: string;
  decorativeElements?: string[];
}

export interface PaymentDetails {
  upiId?: string;
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}
