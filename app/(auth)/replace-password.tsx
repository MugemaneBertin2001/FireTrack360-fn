import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import SnackBar from '@/components/SnackBar';
import { Eye, EyeOff } from 'lucide-react-native';

const ReplaceForgotPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const { replaceForgotPassword } = useAuth(); 

  const handleResetPassword = async () => {
    try {
      if (!password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setIsLoading(true);

      const email = await AsyncStorage.getItem('tempEmail');
      const verificationToken = await AsyncStorage.getItem('verificationToken');

      if (!email || !verificationToken) {
        setSnackbarVisible(true);
        setSnackbarMessage('Session expired. Please try again.');
        setSnackbarType('error');
        return;
      }

      const response = await replaceForgotPassword({
        newPassword: password,
        confirmPassword: confirmPassword,
        email: email,
        verificationToken: verificationToken
      });

      if (response.status === 200) {
        setSnackbarVisible(true);
        setSnackbarMessage('Your password has been updated successfully.');
        setSnackbarType('success');
        await AsyncStorage.multiRemove(['tempEmail', 'verificationToken']);
        router.push('/login');
      } else {
        setSnackbarVisible(true);
        setSnackbarMessage(response.message);
        setSnackbarType('error');
      }
    } catch (error) {
      setSnackbarVisible(true);
      setSnackbarMessage(error instanceof Error ? error.message : 'Password reset failed');
      setSnackbarType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1E293B', '#334155']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter a new password to secure your account.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="Enter your new password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!passwordVisibility}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                    disabled={isLoading}
                  >
                    {passwordVisibility ? 
                      <EyeOff size={20} color="#6B7280" /> : 
                      <Eye size={20} color="#6B7280" />
                    }
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>Must be at least 8 characters long</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    placeholder="Confirm your new password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!confirmPasswordVisibility}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                    disabled={isLoading}
                  >
                    {confirmPasswordVisibility ? 
                      <EyeOff size={20} color="#6B7280" /> : 
                      <Eye size={20} color="#6B7280" />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.resetButton, isLoading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={StyleSheet.absoluteFillObject}
                />
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SnackBar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  resetButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  }
});

export default ReplaceForgotPasswordPage;
