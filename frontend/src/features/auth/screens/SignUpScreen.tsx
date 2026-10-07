import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function SignUpScreen() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isStudent = role === 'student';

  const changeRole = (newRole: UserRole) => {
    setRole(newRole);

    setFullName('');
    setUserId('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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

              <Text style={styles.logoName}>SLIITStack</Text>
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
              Create Your Account
            </Text>

            <Text style={styles.subtitle}>
              {isStudent
                ? 'Create your student account'
                : 'Create your staff account'}
            </Text>

            <Text style={styles.label}>
              Full Name
            </Text>

            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#9A9A9A"
            />

            <Text style={styles.label}>
              {isStudent
                ? 'Student ID'
                : 'Staff ID'}
            </Text>

            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder={
                isStudent
                  ? 'Enter Student ID'
                  : 'Enter Staff ID'
              }
              placeholderTextColor="#9A9A9A"
              autoCapitalize="characters"
            />

            <Text style={styles.label}>
              {isStudent
                ? 'Student E-mail'
                : 'Staff E-mail'}
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your e-mail"
              placeholderTextColor="#9A9A9A"
              keyboardType="email-address"
              autoCapitalize="none"
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

            <Text style={styles.passwordHint}>
              Minimum 6 characters
            </Text>

            <Text style={styles.label}>
              Confirm Password
            </Text>

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
            />

            <Pressable style={styles.signupButton}>
              <Text style={styles.signupButtonText}>
                Sign Up
              </Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
              </Text>

              <Pressable
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginLink}>
                  Login
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },

  subtitle: {
    fontSize: 14,
    color: '#717171',
    marginTop: 3,
    marginBottom: 20,
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

  passwordHint: {
    fontSize: 11,
    color: '#777777',
    marginTop: -10,
    marginBottom: 13,
  },

  signupButton: {
    height: 46,
    backgroundColor: '#30518E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 3,
  },

  loginText: {
    fontSize: 13,
    color: '#555555',
  },

  loginLink: {
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