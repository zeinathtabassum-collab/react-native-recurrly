import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { tabs } from "../../constants/data";
import { colors } from "../../constants/theme";

interface TabIconProps {
  focused: boolean;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  focusedIcon?: React.ComponentProps<typeof Ionicons>["name"];
}

const TabIcon = ({ focused, icon, focusedIcon }: TabIconProps) => {
  return (
    <View style={[styles.iconWrapper, focused ? styles.activePill : styles.inactivePill]}>
      <Ionicons
        name={focused && focusedIcon ? focusedIcon : icon}
        size={22}
        color={focused ? "#ffffff" : "rgba(255,255,255,0.45)"}
      />
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 70,
          marginHorizontal: 20,
          marginBottom: 24,
          borderRadius: 40,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          height: 70,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 0,
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

const styles = StyleSheet.create({
  iconWrapper: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
  },
  activePill: {
    backgroundColor: colors.accent,  // orange circle for active
  },
  inactivePill: {
    backgroundColor: "rgba(255,255,255,0.08)", // subtle dark container for inactive
    borderRadius: 14,                            // rounded square for inactive
    width: 44,
    height: 44,
  },
});

export default TabLayout;