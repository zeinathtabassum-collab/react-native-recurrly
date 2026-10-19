import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/theme";

interface ListHeadingProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function ListHeading({
  title,
  actionLabel,
  onActionPress,
}: ListHeadingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.foreground,
  },
  actionButton: {
    borderWidth: 1.5,
    borderColor: colors.foreground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.foreground,
  },
});
