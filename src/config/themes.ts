import { ThemeConfig } from "@/types";

export const builtInThemes: ThemeConfig[] = [
  {
    id: "classic",
    name: "Classic Elegance",
    colors: {
      primary: "#2C3E50",
      secondary: "#BFA980",
      accent: "#D4AF37",
      background: "#FAF8F5",
      text: "#2C3E50",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
    },
    layout: "classic",
  },
  {
    id: "modern",
    name: "Modern Minimalist",
    colors: {
      primary: "#1A1A2E",
      secondary: "#E94560",
      accent: "#0F3460",
      background: "#FFFFFF",
      text: "#1A1A2E",
    },
    fonts: {
      heading: "Montserrat",
      body: "Open Sans",
    },
    layout: "modern",
  },
  {
    id: "rustic",
    name: "Rustic Charm",
    colors: {
      primary: "#5C4033",
      secondary: "#8B7355",
      accent: "#DAA520",
      background: "#FDF5E6",
      text: "#3E2723",
    },
    fonts: {
      heading: "Amatic SC",
      body: "Josefin Sans",
    },
    layout: "classic",
  },
  {
    id: "floral",
    name: "Garden Romance",
    colors: {
      primary: "#4A5D4F",
      secondary: "#D4A5A5",
      accent: "#E8B4B8",
      background: "#FFF5F5",
      text: "#2D3436",
    },
    fonts: {
      heading: "Great Vibes",
      body: "Quicksand",
    },
    layout: "ornate",
  },
  {
    id: "royal",
    name: "Royal Gold",
    colors: {
      primary: "#1B1464",
      secondary: "#C9B037",
      accent: "#FFD700",
      background: "#0C0C1D",
      text: "#E8E8E8",
    },
    fonts: {
      heading: "Cinzel",
      body: "EB Garamond",
    },
    layout: "ornate",
  },
  {
    id: "tropical",
    name: "Tropical Paradise",
    colors: {
      primary: "#006D77",
      secondary: "#83C5BE",
      accent: "#FFDDD2",
      background: "#EDF6F9",
      text: "#003D44",
    },
    fonts: {
      heading: "Pacifico",
      body: "Poppins",
    },
    layout: "modern",
  },
];
