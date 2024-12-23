import React, { useState, useEffect } from 'react';
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

const VerifyAccountPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const { verifyAccount } = useAuth();

  useEffect(() => {
    loadEmail();
  }, []);

  const loadEmail = async () => {
    const storedEmail = await AsyncStorage.getItem('tempEmail');
    if (storedEmail) setEmail(storedEmail);
  };

  const maskedEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart.length > 2 ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1) : localPart;
    return `${maskedLocalPart}@${domain}`;
  };

  const validateOtp = () => {
    return otp.length === 6;
  };

  const handleVerify = async () => {
    try {
      if (!validateOtp()) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }
      setIsLoading(true);
      const response = await verifyAccount({ email, otp });

      if (response.status === 200) {
        router.push('/login');
      } else {
        setSnackbarVisible(true);
        setSnackbarMessage(response.message);
        setSnackbarType('error');
      }
    } catch (error) {
      setSnackbarVisible(true);
      setSnackbarMessage(error instanceof Error ? error.message : 'Verification failed');
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
              <Text style={styles.title}>Verify Account</Text>
              <Text style={styles.subtitle}>Enter the OTP sent to {maskedEmail(email)}</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="6-digit code"
                  placeholderTextColor="#9CA3AF"
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text.replace(/[^0-9]/g, ''));
                    setError('');
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                  editable={!isLoading}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={StyleSheet.absoluteFillObject}
                />
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive code? </Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text style={styles.resendLink}>Try Again</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: '#D1D5DB',
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
  verifyButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: '#3B82F6',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default VerifyAccountPage;