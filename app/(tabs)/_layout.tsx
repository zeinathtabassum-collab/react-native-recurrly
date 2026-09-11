import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { tabs } from "../../constants/data";
import { colors, components } from "../../constants/theme";

const tabBar = components.tabBar;

interface TabIconProps {
    focused: boolean;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    focusedIcon?: React.ComponentProps<typeof Ionicons>["name"];
}

const TabIcon = ({ focused, icon, focusedIcon }: TabIconProps) => {
    return (
        <View
            style={{
                top: -10, // 👈 moves the icon upward
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Ionicons
                name={focused && focusedIcon ? focusedIcon : icon}
                size={24}
                color={focused ? colors.accent : "#ffffff"}
            />
        </View>
    );
};
const TabLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    marginBottom: 70,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: "center",
                },
                tabBarLabelStyle: {
                    marginTop: -19,
                },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.route}
                    name={tab.route}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon
                                focused={focused}
                                icon={tab.icon}
                                focusedIcon={tab.focusedIcon}
                            />
                        ),
                    }}
                />
            ))}

        </Tabs>
    );
};

export default TabLayout;