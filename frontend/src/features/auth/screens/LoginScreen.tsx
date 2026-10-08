import { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type UserRole = 'student' | 'staff';

export default function LoginScreen() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isStudent = role === 'student';

  const changeRole = (newRole: UserRole) => {
    setRole(newRole);
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/auth/login-top-banner.png')}
            style={styles.topBanner}
            resizeMode="cover"
          />

          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/auth/sliitstack-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.logoName}>
                SLIITStack
              </Text>
            </View>

            <View style={styles.roleSelector}>
              <Pressable
                style={[
                  styles.roleButton,
                  isStudent && styles.activeRoleButton,
                ]}
                onPress={() => changeRole('student')}
              >
                <Text
                  style={[
                    styles.roleText,
                    isStudent && styles.activeRoleText,
                  ]}
                >
                  Student
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleButton,
                  !isStudent && styles.activeRoleButton,
                ]}
                onPress={() => changeRole('staff')}
              >
                <Text
                  style={[
                    styles.roleText,
                    !isStudent && styles.activeRoleText,
                  ]}
                >
                  Staff
                </Text>
              </Pressable>
            </View>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to continue
            </Text>

            <Text style={styles.label}>
              {isStudent
                ? 'Student E-mail'
                : 'Staff E-mail'}
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={
                isStudent
                  ? 'Enter Student E-mail'
                  : 'Enter Staff E-mail'
              }
              placeholderTextColor="#9A9A9A"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
            />

            <Pressable>
              <Text style={styles.forgotPassword}>
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                Login
              </Text>
            </Pressable>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don&apos;t have an account?{' '}
              </Text>

              <Pressable
                onPress={() =>
                  router.push('/signup' as Href)
                }
              >
                <Text style={styles.signupLink}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>

          <Image
            source={require('@/assets/images/auth/login-bottom-banner.png')}
            style={styles.bottomBanner}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DFF4F8',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },

  container: {
    width: '100%',
    maxWidth: 390,
    paddingHorizontal: 14,
  },

  topBanner: {
    width: '100%',
    height: 95,
    borderRadius: 10,
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  logo: {
    width: 38,
    height: 38,
    marginRight: 8,
  },

  logoName: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#152D5A',
  },

  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#EDF1F5',
    padding: 4,
    borderRadius: 8,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
  },

  activeRoleButton: {
    backgroundColor: '#30518E',
  },

  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },

  activeRoleText: {
    color: '#FFFFFF',
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#111111',
  },

  subtitle: {
    fontSize: 14,
    color: '#717171',
    marginTop: 2,
    marginBottom: 21,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 7,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#606060',
    borderRadius: 2,
    paddingHorizontal: 11,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    fontSize: 14,
  },

  forgotPassword: {
    textAlign: 'right',
    color: '#555555',
    fontSize: 13,
    marginTop: -4,
    marginBottom: 17,
  },

  loginButton: {
    height: 46,
    backgroundColor: '#30518E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 3,
  },

  signupText: {
    fontSize: 13,
    color: '#555555',
  },

  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },

  bottomBanner: {
    width: '100%',
    height: 75,
    borderRadius: 8,
    marginTop: 14,
  },
});