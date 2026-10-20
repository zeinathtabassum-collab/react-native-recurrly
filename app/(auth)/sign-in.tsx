import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  AuthButton,
  AuthInput,
  AuthScreenWrapper,
  OTPInput,
} from "@/components/auth/AuthComponents";
import { colors } from "@/constants/theme";

// ─── Validators ───────────────────────────────────────────────────────────────
function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address";
}
function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
}

type ResetStep = "idle" | "sending" | "verifying" | "newPassword";

// ─── Sign-In Screen ───────────────────────────────────────────────────────────
export default function SignInScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow
  const [resetStep, setResetStep] = useState<ResetStep>("idle");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    resetCode?: string;
    newPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // ── Submit sign-in ──────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    if (!signIn) return;

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await signIn.password({
        emailAddress: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const code = (error as any)?.code;
        if (
          code === "form_password_incorrect" ||
          code === "form_identifier_not_found"
        ) {
          setErrors({ general: "Invalid email or password." });
        } else {
          setErrors({
            general:
              (error as any)?.longMessage ||
              (error as any)?.message ||
              "Sign in failed. Please try again.",
          });
        }
        return;
      }

      // status === 'complete' means password was correct → finalize
      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          setErrors({
            general:
              (finalizeError as any)?.longMessage ||
              (finalizeError as any)?.message ||
              "Failed to finalize sign-in.",
          });
          return;
        }
        router.replace("/(tabs)");
      } else {
        setErrors({ general: "Unable to sign in. Please try again." });
      }
    } catch (err: any) {
      setErrors({ general: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: send reset code ───────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!signIn) return;
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: "Enter your email above first" });
      return;
    }

    setErrors({});
    setLoading(true);
    setResetStep("sending");

    try {
      // create() with identifier to identify the user
      const { error: createErr } = await signIn.create({
        identifier: email.trim().toLowerCase(),
      });

      if (createErr) {
        setErrors({
          general:
            (createErr as any)?.longMessage ||
            (createErr as any)?.message ||
            "User not found.",
        });
        setResetStep("idle");
        return;
      }

      // Send the password reset code
      const { error: sendErr } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendErr) {
        setErrors({
          general:
            (sendErr as any)?.longMessage ||
            (sendErr as any)?.message ||
            "Failed to send reset code.",
        });
        setResetStep("idle");
        return;
      }

      setResetStep("verifying");
    } catch (err: any) {
      setErrors({ general: err?.message || "Something went wrong." });
      setResetStep("idle");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: verify code ───────────────────────────────────────────
  const handleVerifyReset = async () => {
    if (!signIn) return;
    if (!resetCode || resetCode.length < 6) {
      setErrors({ resetCode: "Enter the 6-digit code" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code: resetCode,
      });

      if (error) {
        setErrors({
          resetCode:
            (error as any)?.longMessage ||
            (error as any)?.message ||
            "Invalid or expired code.",
        });
        return;
      }

      // Code verified — now collect new password
      setResetStep("newPassword");
    } catch (err: any) {
      setErrors({ resetCode: err?.message || "Verification failed." });
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: submit new password ───────────────────────────────────
  const handleSubmitNewPassword = async () => {
    if (!signIn) return;
    if (!newPassword || newPassword.length < 8) {
      setErrors({ newPassword: "Password must be at least 8 characters" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
        signOutOfOtherSessions: true,
      });

      if (error) {
        setErrors({
          general:
            (error as any)?.longMessage ||
            (error as any)?.message ||
            "Failed to set new password.",
        });
        return;
      }

      // Finalize if complete
      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (!finalizeError) {
          router.replace("/(tabs)");
          return;
        }
      }

      setErrors({ general: "Password reset succeeded. Please sign in." });
      setResetStep("idle");
      setNewPassword("");
      setResetCode("");
    } catch (err: any) {
      setErrors({ general: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Forgot password — verify code view
  // ──────────────────────────────────────────────────────────────────────────
  if (resetStep === "verifying") {
    return (
      <AuthScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setResetStep("idle");
              setResetCode("");
              setErrors({});
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>
              Code sent to{" "}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.iconPill}>
          <Ionicons name="key-outline" size={32} color={colors.accent} />
        </View>

        <Text style={styles.otpLabel}>Enter reset code</Text>
        <OTPInput value={resetCode} onChange={setResetCode} />
        {errors.resetCode ? (
          <Text style={styles.errorText}>{errors.resetCode}</Text>
        ) : null}

        <View style={{ marginTop: 32 }}>
          <AuthButton
            label="Verify Code"
            onPress={handleVerifyReset}
            loading={loading}
            disabled={resetCode.length < 6}
          />
        </View>
      </AuthScreenWrapper>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Forgot password — new password view
  // ──────────────────────────────────────────────────────────────────────────
  if (resetStep === "newPassword") {
    return (
      <AuthScreenWrapper>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>New password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password for your account
            </Text>
          </View>
        </View>

        <View style={styles.iconPill}>
          <Ionicons name="lock-closed-outline" size={32} color={colors.accent} />
        </View>

        <AuthInput
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Min. 8 characters"
          secureTextEntry={!showNewPassword}
          error={errors.newPassword}
          autoFocus
          rightElement={
            <TouchableOpacity
              onPress={() => setShowNewPassword((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          }
        />

        {errors.general ? (
          <View style={styles.generalError}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={colors.destructive}
            />
            <Text style={styles.generalErrorText}>{errors.general}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: 8 }}>
          <AuthButton
            label="Set New Password"
            onPress={handleSubmitNewPassword}
            loading={loading}
            disabled={newPassword.length < 8}
          />
        </View>
      </AuthScreenWrapper>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Sign-In form view
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <AuthScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Recurrly account</Text>
        </View>
      </View>

      {/* Greeting card */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingIcon}>
          <Ionicons name="sparkles" size={20} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetingTitle}>Good to see you again</Text>
          <Text style={styles.greetingSubtitle}>
            All your subscriptions are waiting
          </Text>
        </View>
      </View>

      <AuthInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email}
      />

      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry={!showPassword}
        error={errors.password}
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        }
      />

      <TouchableOpacity
        onPress={handleForgotPassword}
        activeOpacity={0.7}
        style={styles.forgotBtn}
        disabled={loading}
      >
        <Text style={styles.forgotText}>
          {resetStep === "sending" && loading
            ? "Sending code…"
            : "Forgot password?"}
        </Text>
      </TouchableOpacity>

      {errors.general ? (
        <View style={styles.generalError}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colors.destructive}
          />
          <Text style={styles.generalErrorText}>{errors.general}</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 8 }}>
        <AuthButton label="Sign In" onPress={handleSignIn} loading={loading} />
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>secure</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.trustRow}>
        <TrustBadge icon="shield-checkmark-outline" label="256-bit SSL" />
        <TrustBadge icon="lock-closed-outline" label="End-to-end encrypted" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New to Recurrly? </Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthScreenWrapper>
  );
}

// ─── Trust Badge ──────────────────────────────────────────────────────────────
function TrustBadge({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
}) {
  return (
    <View style={styles.trustBadge}>
      <Ionicons name={icon} size={14} color={colors.success} />
      <Text style={styles.trustLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "sans-Bold",
  },
  subtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    marginTop: 2,
  },
  emailHighlight: {
    fontFamily: "sans-SemiBold",
    color: colors.foreground,
  },
  greetingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  greetingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
  },
  greetingSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    marginTop: 2,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -10,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: colors.accent,
    fontFamily: "sans-SemiBold",
    fontWeight: "600",
  },
  generalError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  generalErrorText: {
    flex: 1,
    fontSize: 13,
    color: colors.destructive,
    fontFamily: "sans-Regular",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  trustRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 4,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  trustLabel: {
    fontSize: 11,
    color: colors.success,
    fontFamily: "sans-SemiBold",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accent,
    fontFamily: "sans-Bold",
  },
  iconPill: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
    textAlign: "center",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    fontFamily: "sans-Regular",
    textAlign: "center",
    marginTop: 8,
  },
});
