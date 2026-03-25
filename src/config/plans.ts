export const FEATURES = {
  BASIC: {
    rsvp: true,
    themeSelection: true,
    aiThemeGeneration: true,
    aiGenerationLimit: 2,
    customMessage: true,
    guestLimit: 100,
    messageBoard: true,
    voiceNotes: false,
    paymentQr: false,
    giftRegistry: false,
    imageGallery: false,
    exportData: true,
  },
  PREMIUM: {
    rsvp: true,
    themeSelection: true,
    aiThemeGeneration: true,
    aiGenerationLimit: 10,
    customMessage: true,
    guestLimit: 500,
    messageBoard: true,
    voiceNotes: true,
    paymentQr: true,
    giftRegistry: true,
    imageGallery: true,
    exportData: true,
  },
} as const;

export const BASIC_PRICE = 20;
export const PREMIUM_PRICE = 80;
export const PARTNER_PRICE = 400;
export const PARTNER_CARDS = 100;

export const BASIC_FEATURES_LIST = [
  "RSVP Management",
  "Up to 100 Guests",
  "6 Built-in Themes",
  "AI Theme Generation (2 tries)",
  "Guest Message Board",
  "Custom Message",
  "Data Export",
];

export const PREMIUM_FEATURES_LIST = [
  "Everything in Basic",
  "Up to 500 Guests",
  "10 AI Theme Generations",
  "Voice Notes from Guests",
  "QR Payment Code",
  "Gift Registry",
  "Photo Gallery",
];
