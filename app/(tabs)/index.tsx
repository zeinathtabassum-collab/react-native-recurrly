import ListHeading from "@/components/ListHeading";
import SwipeableSubscriptionCard from "@/components/SwipeableSubscriptionCard";
import UpcomingSubscriptionsCard from "@/components/UpcomingSubscriptionsCard";

import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

import images from "@/constants/images";
import { colors } from "@/constants/theme";

import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useState } from "react";

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  GestureHandlerRootView,
  ScrollView as GHScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] =
    useState<string | null>(null);

  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);

  const handleDelete = (name: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.name !== name));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.Background,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          {/* ================= HEADER ================= */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              marginBottom: 24,
            }}
          >
            {/* Avatar + Name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image
                source={images.avatar}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                }}
              />

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.foreground,
                }}
              >
                {HOME_USER.name}
              </Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: colors.foreground,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="add"
                size={22}
                color={colors.foreground}
              />
            </TouchableOpacity>
          </View>

          {/* ================= BALANCE CARD ================= */}
          <View
            style={{
              backgroundColor: colors.accent,
              borderRadius: 20,
              padding: 24,
              paddingBottom: 28,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                fontWeight: "500",
                marginBottom: 24,
              }}
            >
              Balance
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 36,
                  fontWeight: "700",
                  letterSpacing: -0.5,
                }}
              >
                {HOME_BALANCE.amount}
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 16,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
              </Text>
            </View>
          </View>

          {/* ================= UPCOMING ================= */}
          <View style={{ marginTop: 24 }}>
            <ListHeading
              title="Upcoming"
              actionLabel="View all"
            />

            <GHScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 12,
                gap: 16,
                paddingRight: 4,
              }}
            >
              {UPCOMING_SUBSCRIPTIONS.length === 0 ? (
                <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
                  No upcoming renewals yet.
                </Text>
              ) : (
                UPCOMING_SUBSCRIPTIONS.map((item) => (
                  <UpcomingSubscriptionsCard key={item.name} data={item} />
                ))
              )}
            </GHScrollView>
          </View>

          {/* ================= ALL SUBSCRIPTIONS ================= */}
          <View style={{ marginTop: 8, marginBottom: 20 }}>
            <ListHeading
              title="All Subscriptions"
              actionLabel="View all"
            />

            {subscriptions.map((sub) => (
              <SwipeableSubscriptionCard
                key={sub.name}
                {...sub}
                expanded={expandedSubscriptionId === sub.name}
                onPress={() =>
                  setExpandedSubscriptionId((currentId) =>
                    currentId === sub.name ? null : sub.name
                  )
                }
                onDelete={handleDelete}
              />
            ))}

            {subscriptions.length === 0 && (
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 24,
                }}
              >
                No subscriptions yet. Add one!
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
