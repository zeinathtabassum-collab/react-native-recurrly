import type { ImageSourcePropType } from "react-native";
declare global {
    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface UpcomingSubscription {
        name: string;
        price: number;
        daysLeft: number;
        icon?: ImageSourcePropType;
        currency: string;
    }
}
export { };

