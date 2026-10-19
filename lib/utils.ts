import dayjs from "dayjs";

export function formatCurrency(value: number, currency: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    const symbol = currency === "USD" ? "$" : currency + " ";
    return `${symbol}${value.toFixed(2)}`;
  }
}

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parseDate = dayjs(value);
  return parseDate.isValid() ? parseDate.format("MMM D, YYYY h:mm A") : "Not provided"
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1)
};