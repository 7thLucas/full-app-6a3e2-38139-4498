/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // Happy Meal content
  appTagline?: string;
  appDescription?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroCta?: string;
  // Meal plan settings
  mealsPerDay?: number;
  daysPerWeek?: number;
  enableShoppingList?: boolean;
  enableNutrition?: boolean;
  // Dietary options
  availableDiets?: string[];
  availableGoals?: string[];
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Happy Meal",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#FFFBF5",
    foreground:        "#1C1917",
    // Card
    card:              "#FFF7ED",
    cardForeground:    "#1C1917",
    // Popover
    popover:           "#FFFFFF",
    popoverForeground: "#1C1917",
    // Primary
    primary:           "#F97316",
    primaryForeground: "#FFFFFF",
    // Secondary
    secondary:           "#22C55E",
    secondaryForeground: "#FFFFFF",
    // Muted
    muted:           "#FEF3C7",
    mutedForeground: "#78716C",
    // Accent
    accent:           "#FED7AA",
    accentForeground: "#9A3412",
    // Destructive
    destructive:           "#EF4444",
    destructiveForeground: "#FFFFFF",
    // Border / Input / Ring
    border: "#FDE68A",
    input:  "#FEF3C7",
    ring:   "#F97316",
    // Charts
    chart1: "#F97316",
    chart2: "#22C55E",
    chart3: "#EAB308",
    chart4: "#EC4899",
    chart5: "#8B5CF6",
    // Navbar
    navbarBackground: "#FFF7ED",
    // Sidebar
    sidebarBackground:        "#FFF7ED",
    sidebarForeground:        "#1C1917",
    sidebarPrimary:           "#F97316",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent:            "#FED7AA",
    sidebarAccentForeground:  "#9A3412",
    sidebarBorder:            "#FDE68A",
    sidebarRing:              "#F97316",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Nunito",
  },
  // ── Happy Meal defaults ───────────────────────────────────────────────
  appTagline: "Your personal AI meal planner",
  appDescription: "Stop stressing about what to eat. Happy Meal suggests personalized meals based on your goals, preferences, and what's in your kitchen.",
  heroHeading: "What's for dinner tonight?",
  heroSubheading: "Let AI do the thinking. You do the eating.",
  heroCta: "Generate My Meal Plan",
  mealsPerDay: 3,
  daysPerWeek: 7,
  enableShoppingList: true,
  enableNutrition: true,
  availableDiets: ["No Restriction", "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Gluten-Free", "Dairy-Free", "Halal", "Kosher"],
  availableGoals: ["Eat Healthier", "Lose Weight", "Build Muscle", "Maintain Weight", "Increase Energy", "Reduce Stress", "Improve Digestion"],
};
