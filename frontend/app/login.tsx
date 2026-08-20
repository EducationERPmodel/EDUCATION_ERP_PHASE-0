import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../src/theme/colors';

const VALID_EMAIL    = 'lokesh@erp.com';
const VALID_PASSWORD = '12345';

interface Feature {
  icon: string;
  text: string;
}

const FEATURES: Feature[] = [
  { icon: 'people-outline',        text: 'Student Management' },
  { icon: 'checkbox-outline',      text: 'Attendance Tracking' },
  { icon: 'bar-chart-outline',     text: 'IA Marks & Grades' },
  { icon: 'hardware-chip-outline', text: 'AI Plagiarism Checker' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [emailFocus,   setEmailFocus]   = useState(false);
  const [passFocus,    setPassFocus]    = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your faculty email.');
      return;
    }
    if (!password) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }

    setLoading(true);
    await new Promise<void>(r => setTimeout(r, 600));
    setLoading(false);

    if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
      router.replace('/(app)/dashboard');
    } else {
      Alert.alert(
        '❌ Login Failed',
        'Invalid email or password.\n\nHint: lokesh@erp.com / 12345',
        [{ text: 'Try Again', style: 'default' }]
      );
    }
  }

  function fillDemo() {
    setEmail(VALID_EMAIL);
    setPassword(VALID_PASSWORD);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Branding panel */}
          <View style={styles.branding}>
            <View style={styles.logoCircle}>
              <Ionicons name="school" size={42} color={Colors.primary} />
            </View>
            <Text style={styles.brandTitle}>Student ERP</Text>
            <Text style={styles.brandSubtitle}>SVCE Faculty Portal</Text>
            <View style={styles.featureGrid}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.featureChip}>
                  <Ionicons name={f.icon as any} size={14} color={Colors.white} />
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Login card */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Welcome back 👋</Text>
            <Text style={styles.welcomeSub}>Sign in to continue</Text>

            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputBox, emailFocus && styles.inputBoxFocused]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={emailFocus ? Colors.primary : Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="faculty@svce.edu"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                returnKeyType="next"
                editable={!loading}
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={() => setEmail('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={[styles.inputBox, passFocus && styles.inputBoxFocused]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={passFocus ? Colors.primary : Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={Colors.white} size="small" />
                  <Text style={[styles.loginBtnText, { marginLeft: 10 }]}>Signing in...</Text>
                </View>
              ) : (
                <View style={styles.loginBtnRow}>
                  <Ionicons name="log-in-outline" size={20} color={Colors.white} />
                  <Text style={styles.loginBtnText}>Sign In</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoHint} onPress={fillDemo}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.primary} />
              <Text style={styles.demoText}>Tap to fill demo credentials</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SVCE Bengaluru</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.footer}>
              Sri Venkateshwara College of Engineering{'\n'}
              Autonomous Institute • Est. 2001
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.primary },
  flex:      { flex: 1 },
  container: { flexGrow: 1, backgroundColor: Colors.primary, padding: 20, justifyContent: 'center' },
  branding:    { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14, elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 8,
  },
  brandTitle:    { fontSize: 28, fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: '600' },
  featureGrid:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 },
  featureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  featureText: { fontSize: 11, color: Colors.white, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white, borderRadius: 24, padding: 28,
    elevation: 12, shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 16,
  },
  welcomeTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  welcomeSub:   { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, marginTop: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 6, marginTop: 4 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    marginBottom: 16, borderWidth: 1.5, borderColor: Colors.border,
  },
  inputBoxFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  inputIcon:      { marginRight: 10 },
  input:          { flex: 1, fontSize: 15, color: Colors.textPrimary },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 6,
    elevation: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  loginBtnDisabled: { opacity: 0.7, elevation: 0 },
  loginBtnRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingRow:   { flexDirection: 'row', alignItems: 'center' },
  loginBtnText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  demoHint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    marginTop: 14, paddingVertical: 8,
    backgroundColor: Colors.primaryLight, borderRadius: 10,
  },
  demoText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  divider:     { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  footer: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 18 },
});
