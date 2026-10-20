import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}

export function OTPInput({ value, onChange, length = 6 }: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
      {digits.map((digit, i) => {
        const isCurrent = i === value.length;
        return (
          <View
            key={i}
            style={[
              styles.otpCell,
              isCurrent && styles.otpCellActive,
              digit && styles.otpCellFilled,
            ]}
          >
            <Text style={styles.otpDigit}>{digit}</Text>
            {isCurrent && <View style={styles.otpCursor} />}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.otpHiddenInput}
        autoFocus
      />
    </Pressable>
  );
}

interface AuthHeaderProps {
  onBack: () => void;
  title: string;
  subtitle: string;
}

export function AuthHeader({ onBack, title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={colors.foreground} />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AuthButton({
  label,
  onPress,
  loading,
  disabled,
}: AuthButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[styles.authButton, (disabled || loading) && styles.authButtonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.authButtonText}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoComplete?: "email" | "password" | "new-password" | "off";
  secureTextEntry?: boolean;
  error?: string;
  autoFocus?: boolean;
  rightElement?: React.ReactNode;
}

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  autoComplete,
  secureTextEntry,
  error,
  autoFocus,
  rightElement,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
        ]}
      >
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(8,17,38,0.35)"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

interface AuthScreenWrapperProps {
  children: React.ReactNode;
}

export function AuthScreenWrapper({ children }: AuthScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          removeClippedSubviews={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
    marginBottom: 36,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "sans-Bold",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
  },

  // Input
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: colors.accent,
  },
  inputWrapperError: {
    borderColor: colors.destructive,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: colors.foreground,
    fontFamily: "sans-Regular",
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    fontFamily: "sans-Regular",
    marginTop: 6,
    marginLeft: 4,
  },

  // Button
  authButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "sans-Bold",
    letterSpacing: 0.3,
  },

  // OTP
  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    position: "relative",
    marginVertical: 8,
  },
  otpCell: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  otpCellActive: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  otpCellFilled: {
    borderColor: colors.foreground,
    backgroundColor: colors.muted,
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "sans-Bold",
  },
  otpCursor: {
    position: "absolute",
    width: 2,
    height: 22,
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  otpHiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
