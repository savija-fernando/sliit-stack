import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type UserRole = 'student' | 'staff';

export default function LoginScreen() {
  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const isStudent = role === 'student';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Temporary banner until Figma assets are exported */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>SLIITStack</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.logoText}>SLIITStack</Text>

          {/* Student / Staff selector */}
          <View style={styles.roleSelector}>
            <Pressable
              style={[
                styles.roleButton,
                isStudent && styles.activeRoleButton,
              ]}
              onPress={() => setRole('student')}>
              <Text
                style={[
                  styles.roleText,
                  isStudent && styles.activeRoleText,
                ]}>
                Student
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.roleButton,
                !isStudent && styles.activeRoleButton,
              ]}
              onPress={() => setRole('staff')}>
              <Text
                style={[
                  styles.roleText,
                  !isStudent && styles.activeRoleText,
                ]}>
                Staff
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <Text style={styles.label}>
            {isStudent ? 'E-mail' : 'Staff ID'}
          </Text>

          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder={isStudent ? 'Enter your e-mail' : 'Enter Staff ID'}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />

          <Pressable>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable style={styles.googleButton}>
            <Text style={styles.googleText}>G</Text>
            <Text style={styles.googleButtonText}>
              Continue with Google
            </Text>
          </Pressable>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don&apos;t have an account?{' '}
            </Text>

            <Pressable>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Temporary bottom image area */}
        <View style={styles.bottomBanner}>
          <Text style={styles.bottomBannerText}>Study • Reserve • Learn</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDF3F8',
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  banner: {
    height: 90,
    borderRadius: 10,
    backgroundColor: '#B7D8E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  bannerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C4C8A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
  },

  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C4C8A',
    marginBottom: 14,
  },

  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#EDF1F5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 6,
  },

  activeRoleButton: {
    backgroundColor: '#2F5597',
  },

  roleText: {
    fontWeight: '600',
    color: '#555555',
  },

  activeRoleText: {
    color: '#FFFFFF',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111111',
  },

  subtitle: {
    color: '#777777',
    marginTop: 3,
    marginBottom: 22,
  },

  label: {
    fontWeight: '600',
    marginBottom: 7,
    color: '#222222',
  },

  input: {
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 4,
    height: 46,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#555555',
    marginBottom: 18,
  },

  loginButton: {
    backgroundColor: '#2F5597',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#999999',
  },

  orText: {
    marginHorizontal: 12,
    color: '#555555',
  },

  googleButton: {
    height: 48,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  googleText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#4285F4',
  },

  googleButtonText: {
    fontWeight: '600',
    color: '#222222',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  signupText: {
    color: '#555555',
  },

  signupLink: {
    fontWeight: '700',
    color: '#111111',
  },

  bottomBanner: {
    height: 65,
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#C8D6DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBannerText: {
    fontWeight: '600',
    color: '#43535A',
  },
});