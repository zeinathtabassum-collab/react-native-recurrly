
export const colors = {
    Background: "#fff9e3",
    foreground: "#081126",
    primary: "#081126",
    accent: "#ea7a53",
    card: "#fff8e7",
    muted: "#f6eecf",
    mutedForeground: "rgba(8, 17, 38, 0.70)",
    border: "rgba(0, 0, 0, 0.1)",
    success: "#16a34a",
    destructive: "#dc2626",
    subscription: "#11ab92",
} as const;

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    30: 120,
} as const;

export const components = {
    tabBar: {
        height: spacing[18],
        horizontalInset: spacing[5],
        radius: spacing[8],
        iconFrame: spacing[12],
        itemPaddingVertical: spacing[2],
    }
} as const;

export const theme = {
    colors,
    spacing,
    components,
} as const;