import { formatCurrency } from "@/lib/utils";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const UpcomingSubscriptionsCard = ({
    data: { name, price, daysLeft, icon, currency },
}: {
    data: UpcomingSubscription;
}) => {
    return (
        <View style={styles.card}>
            {/* Top row: icon left, price + days right */}
            <View style={styles.topRow}>
                {icon && (
                    <View style={styles.iconBox}>
                        <Image
                            source={icon}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                )} 
                <View style={styles.priceGroup}>
                    <Text style={styles.price}>
                        {formatCurrency(price, currency)}
                    </Text>
                    <Text style={styles.days}>
                        {daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
                    </Text>
                </View>
            </View>

            {/* Name below */}
            <Text style={styles.name} numberOfLines={1}>
                {name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.border,
        padding: 16,
        marginRight: 12,
        width: 150,
        height: 150,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 6,
    },
    priceGroup: {
        flexDirection: "column",
    },
    price: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.foreground,
    },
    days: {
        fontSize: 12,
        fontWeight: "400",
        color: colors.mutedForeground,
        marginTop: 2,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.foreground,
    },
});

export default UpcomingSubscriptionsCard;
