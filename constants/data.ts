import { Ionicons } from "@expo/vector-icons";
import { icons } from "@/constants/icons";

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  renewalDate: string;
  icon?: string;
};

export const HOME_USER = {
  name: "Adrian | JS Mastery",
};

export const HOME_BALANCE = {
  amount: "$1,234.56",
  nextRenewalDate: "2026-10-01",
};

export const UPCOMING_SUBSCRIPTIONS: UpcomingSubscription[] = [
  {
    name: "Spotify",
    price: 5.99,
    currency: "USD",
    daysLeft: 2,
    icon: icons.spotify,
  },
  {
    name: "Notion",
    price: 12.00,
    currency: "USD",
    daysLeft: 4,
    icon: icons.notion,
  },
  {
    name: "Figma",
    price: 15.00,
    currency: "USD",
    daysLeft: 6,
    icon: icons.figma,
  },
];

export type UpcomingSubscription = {
  name: string;
  price: number;
  currency: string;
  daysLeft: number;
  icon: any;
};

export const HOME_SUBSCRIPTIONS = [
  {
    name: "Adobe Creative Cloud",
    price: 77.49,
    currency: "USD",
    icon: icons.adobe,
    billing: "Monthly",
    category: "Design",
    color: "#86e8d4",
    details: "All apps plan — includes Photoshop, Illustrator, Premiere Pro & more.",
  },
  {
    name: "Spotify",
    price: 5.99,
    currency: "USD",
    icon: icons.spotify,
    billing: "Monthly",
    category: "Music",
    color: "#b8f5b0",
    details: "Individual plan — ad-free streaming on all devices.",
  },
  {
    name: "Notion",
    price: 12.0,
    currency: "USD",
    icon: icons.notion,
    billing: "Monthly",
    category: "Productivity",
    color: "#d4c5f9",
    details: "Plus plan — unlimited blocks, file uploads & version history.",
  },
  {
    name: "Figma",
    price: 15.0,
    currency: "USD",
    icon: icons.figma,
    billing: "Monthly",
    category: "Design",
    color: "#ffc5b0",
    details: "Professional plan — unlimited projects & advanced prototyping.",
  },
];

export const tabs: {
  title: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  focusedIcon?: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  {
    title: "Home",
    route: "index",
    icon: "home-outline",
    focusedIcon: "home",
  },
  {
    title: "Subscription",
    route: "subscription",
    icon: "wallet-outline",
    focusedIcon: "wallet",
  },
  {
    title: "Insights",
    route: "insights",
    icon: "trending-up-outline",
    focusedIcon: "trending-up",
  },
  {
    title: "Settings",
    route: "settings",
    icon: "settings-outline",
    focusedIcon: "settings",
  },
];