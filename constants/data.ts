import { Ionicons } from "@expo/vector-icons";

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
      icon: "card-outline",
      focusedIcon: "card",
    },
    {
      title: "Insights",
      route: "insights",
      icon: "bar-chart-outline",
      focusedIcon: "bar-chart",
    },
    {
      title: "Settings",
      route: "settings",
      icon: "settings-outline",
      focusedIcon: "settings",
    },
  ];