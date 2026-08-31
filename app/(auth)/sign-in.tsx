import { Link } from "expo-router";
import { Text, View } from "react-native";

const signIn = () => {
  return (
    <View>
      <Text>signIn</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default signIn;
