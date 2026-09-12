import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-extrabold"> Home </Text>

      <Link href="/Onboarding" asChild>
        <Pressable className="rounded bg-black p-4 font-sans-bold">
          <Text className="text-white">Go to Onboarding</Text>
        </Pressable>
      </Link>

      <Link href="/sign-in" asChild>
        <Pressable className="rounded bg-black p-4 font-sans-bold">
          <Text className="text-white">Go to Sign In</Text>
        </Pressable>
      </Link>

      <Link href="/sign-up" asChild>
        <Pressable className="rounded bg-black p-4 font-sans-bold">
          <Text className="text-white">Go to Sign Up</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
