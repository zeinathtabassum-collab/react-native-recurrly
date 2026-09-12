import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to NativeWind!
      </Text>

      <Link href="/Onboarding" asChild>
        <Pressable className="rounded bg-black p-4">
          <Text className="text-white">Go to Onboarding</Text>
        </Pressable>
      </Link>

      <Link href="/sign-in" asChild>
        <Pressable className="rounded bg-black p-4">
          <Text className="text-white">Go to Sign In</Text>
        </Pressable>
      </Link>

      <Link href="/sign-up" asChild>
        <Pressable className="rounded bg-black p-4">
          <Text className="text-white">Go to Sign Up</Text>
        </Pressable>
      </Link>

      <Link href="/subscriptions/spotify" asChild>
        <Pressable className="rounded bg-black p-4">
          <Text className="text-white">Spotify Subscription</Text>
        </Pressable>

      </Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
        asChild
      >
        <Pressable className="rounded bg-black p-4">
          <Text className="text-white">Claude Max Subscription</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
