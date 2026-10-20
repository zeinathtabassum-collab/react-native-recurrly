import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/expo";
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
  if (password.length < 8) return "Must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Include at least one number";
}
function validateName(name: string): string | undefined {
  if (!name.trim()) return "Required";
  if (name.trim().length < 2) return "Too short";
}

// ─── Sign-Up Screen ───────────────────────────────────────────────────────────
export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    code?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // ── Create account & send OTP ───────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!signUp) return;

    const firstNameErr = validateName(firstName);
    const lastNameErr = validateName(lastName);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (firstNameErr || lastNameErr || emailErr || passwordErr) {
      setErrors({
        firstName: firstNameErr,
        lastName: lastNameErr,
        email: emailErr,
        password: passwordErr,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Use the password-based sign-up (new Future API)
      const { error } = await signUp.password({
        emailAddress: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (error) {
        setErrors({
          general:
            (error as any)?.longMessage ||
            (error as any)?.message ||
            "Could not create account. Please try again.",
        });
        return;
      }

      // Send verification email
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrors({
          general:
            (sendError as any)?.longMessage ||
            (sendError as any)?.message ||
            "Failed to send verification code.",
        });
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      setErrors({ general: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (!signUp) return;

    if (!code || code.length < 6) {
      setErrors({ code: "Enter the 6-digit code" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        setErrors({
          code:
            (error as any)?.longMessage ||
            (error as any)?.message ||
            "Invalid code. Try again.",
        });
        return;
      }

      // Check sign-up status and finalize if complete
      if (signUp.status === "complete") {
        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          setErrors({
            general:
              (finalizeError as any)?.longMessage ||
              (finalizeError as any)?.message ||
              "Failed to complete sign-up.",
          });
          return;
        }
        router.replace("/(tabs)");
      } else {
        setErrors({ code: "Verification incomplete. Please try again." });
      }
    } catch (err: any) {
      setErrors({ code: err?.message || "Verification failed." });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!signUp) return;
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setErrors({ general: (error as any)?.message || "Failed to resend." });
    } else {
      setCode("");
      setErrors({});
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // OTP Verification view
  // ──────────────────────────────────────────────────────────────────────────
  if (pendingVerification) {
    return (
      <AuthScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setPendingVerification(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{" "}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.iconPill}>
          <Ionicons name="mail-open-outline" size={32} color={colors.accent} />
        </View>

        <Text style={styles.otpLabel}>Enter verification code</Text>
        <OTPInput value={code} onChange={setCode} />

        {errors.code ? (
          <Text style={styles.errorText}>{errors.code}</Text>
        ) : null}
        {errors.general ? (
          <Text style={styles.errorText}>{errors.general}</Text>
        ) : null}

        <View style={{ marginTop: 32 }}>
          <AuthButton
            label="Verify & Create Account"
            onPress={handleVerify}
            loading={loading}
            disabled={code.length < 6}
          />
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get a code? </Text>
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </AuthScreenWrapper>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Sign-Up form view
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Track every subscription in one place
          </Text>
        </View>
      </View>

      <View style={styles.brandBadge}>
        <View style={styles.brandDot} />
        <Text style={styles.brandLabel}>Recurrly</Text>
      </View>

      <View style={styles.nameRow}>
        <View style={{ flex: 1 }}>
          <AuthInput
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Alex"
            error={errors.firstName}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AuthInput
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Johnson"
            error={errors.lastName}
          />
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
        placeholder="Min. 8 chars, 1 uppercase, 1 number"
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

      <PasswordStrengthBar password={password} />

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
          label="Create Account"
          onPress={handleSignUp}
          loading={loading}
        />
      </View>

      {/* Required for web CAPTCHA on Expo web */}
      <View nativeID="clerk-captcha" />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.terms}>
        By creating an account, you agree to our{" "}
        <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
        <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </AuthScreenWrapper>
  );
}

// ─── Password Strength Bar ────────────────────────────────────────────────────
function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const barColors = [colors.destructive, "#f59e0b", "#3b82f6", colors.success];
  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  i < strength ? barColors[strength - 1] : colors.muted,
              },
            ]}
          />
        ))}
      </View>
      <Text
        style={[
          styles.strengthLabel,
          {
            color:
              strength > 0
                ? barColors[strength - 1]
                : colors.mutedForeground,
          },
        ]}
      >
        {strength > 0 ? labels[strength - 1] : ""}
      </Text>
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
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.muted,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 28,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  brandLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    fontFamily: "sans-Regular",
    textAlign: "center",
    marginTop: 8,
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
  terms: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.foreground,
    fontFamily: "sans-SemiBold",
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
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "sans-Regular",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accent,
    fontFamily: "sans-Bold",
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -10,
    marginBottom: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontFamily: "sans-SemiBold",
    minWidth: 40,
    textAlign: "right",
  },
});
