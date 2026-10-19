import { formatCurrency } from '@/lib/utils';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SubscriptionCardProps {
  name: string;
  price: number;
  currency: string;
  icon: ImageSourcePropType;
  billing: string;
  color?: string;
  category?: string;
  details?: string;
  expanded: boolean;
  onPress: () => void;
}

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color = '#86e8d4',
  category,
  details,
  expanded,
  onPress,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: color }]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <Image
            source={icon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Name + category */}
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {category ? (
            <Text style={styles.category}>{category}</Text>
          ) : null}
        </View>

        {/* Price + billing */}
        <View style={styles.priceBlock}>
          <Text style={styles.price}>
            {formatCurrency(price, currency)}
          </Text>
          <Text style={styles.billing}>{billing}</Text>
        </View>
      </View>

      {/* Expanded details */}
      {expanded && details ? (
        <View style={styles.detailsRow}>
          <Text style={styles.details}>{details}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#081126',
    marginBottom: 3,
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(8,17,38,0.65)',
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#081126',
    marginBottom: 3,
  },
  billing: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(8,17,38,0.65)',
  },
  detailsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(8,17,38,0.12)',
  },
  details: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(8,17,38,0.75)',
    lineHeight: 20,
  },
});
