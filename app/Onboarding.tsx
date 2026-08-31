import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Onboarding = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-900">
        Onboarding Screen
      </Text>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable className="rounded-xl bg-primary px-6 py-3.5 shadow-md active:opacity-80">
          <Text className="text-center font-semibold text-white">
            Go to Sign In
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Onboarding;
