import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import React, { useRef } from "react";
import {
  Animated,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SubscriptionCard from "./SubscriptionCard";

interface SwipeableSubscriptionCardProps {
  name: string;
  price: number;
  currency: string;
  icon: ImageSourcePropType;
  billing: string;
  color?: string;
  category?: string;
  details?: string;
  // Expanded detail fields
  paymentMethod?: string;
  categoryPlan?: string;
  startDate?: string;
  renewalDate?: string;
  status?: string;
  expanded: boolean;
  onPress: () => void;
  onDelete?: (name: string) => void;
}

const SwipeableSubscriptionCard = ({
  onDelete,
  ...cardProps
}: SwipeableSubscriptionCardProps) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.6],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.(cardProps.name);
          }}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </Animated.View>
          <Text style={styles.deleteLabel}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={1.8}
      rightThreshold={40}
    >
      <SubscriptionCard {...cardProps} />
    </Swipeable>
  );
};

export default SwipeableSubscriptionCard;

const styles = StyleSheet.create({
  rightActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 12,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 18,
    width: 72,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  deleteLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
