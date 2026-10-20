import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

const FEATURES = [
  {
    icon: "card-outline" as const,
    label: "Track every subscription",
    color: colors.accent,
  },
  {
    icon: "notifications-outline" as const,
    label: "Renewal reminders",
    color: "#6366f1",
  },
  {
    icon: "analytics-outline" as const,
    label: "Spending insights",
    color: colors.success,
  },
];

export default function Onboarding() {
  const router = useRouter();

  // Entrance animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(cardAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 10,
          bounciness: 6,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {/* ─── Top brand section ─── */}
      <Animated.View
        style={[
          styles.hero,
          {
            opacity: logoAnim,
            transform: [
              {
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Logo mark */}
        <View style={styles.logoMark}>
          <Ionicons name="repeat-outline" size={32} color="#fff" />
        </View>

        <Text style={styles.wordmark}>Recurrly</Text>
        <Text style={styles.tagline}>
          All your subscriptions.{"\n"}One clear picture.
        </Text>
      </Animated.View>

      {/* ─── Feature card ─── */}
      <Animated.View
        style={[
          styles.featureCard,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardAnim }],
          },
        ]}
      >
        <Text style={styles.featureCardTitle}>Everything you need</Text>

        {FEATURES.map((f) => (
          <View key={f.label} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: f.color + "22" }]}>
              <Ionicons name={f.icon} size={18} color={f.color} />
            </View>
            <Text style={styles.featureLabel}>{f.label}</Text>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success}
            />
          </View>
        ))}

        {/* Stat strip */}
        <View style={styles.statStrip}>
          <StatPill value="10k+" label="Users" />
          <View style={styles.statDivider} />
          <StatPill value="$2M+" label="Tracked" />
          <View style={styles.statDivider} />
          <StatPill value="4.9★" label="Rating" />
        </View>
      </Animated.View>

      {/* ─── CTA buttons ─── */}
      <Animated.View style={[styles.ctaSection, { opacity: btnAnim }]}>
        <Link href="/(auth)/sign-up" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Get started — it's free</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </Link>

        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.legalNote}>
          No credit card required · Cancel anytime
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.Background,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: 32,
    gap: 16,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  wordmark: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "sans-ExtraBold",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    textAlign: "center",
    lineHeight: 24,
  },

  // Feature card
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  featureCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "sans-Bold",
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
    fontFamily: "sans-Medium",
    fontWeight: "500",
  },

  // Stat strip
  statStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
  },
  statPill: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "sans-Bold",
  },
  statLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },

  // CTA
  ctaSection: {
    gap: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 18,
    height: 56,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.1,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "sans-Bold",
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
  },
  legalNote: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    textAlign: "center",
  },
});
