// hooks/useAuth.ts
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { 
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  VERIFY_ACCOUNT_MUTATION,
  VERIFY_LOGIN_MUTATION,
  FORGET_PASSWORD_MUTATION,
  VERIFY_PASSWORD_FORGET_MUTATION,
  REPLACE_FORGOT_PASSWORD_MUTATION,
  RESEND_VERIFICATION_OTP_MUTATION
} from '../lib/graphql/auth';
import { RegisterInput, LoginInput, NewPasswordInput, VerificationInput } from '../types/graphql';

export function useAuth() {
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [verifyAccountMutation] = useMutation(VERIFY_ACCOUNT_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [verifyLoginMutation] = useMutation(VERIFY_LOGIN_MUTATION);
  const [forgetPasswordMutation] = useMutation(FORGET_PASSWORD_MUTATION);
  const [verifyPasswordForgetMutation] = useMutation(VERIFY_PASSWORD_FORGET_MUTATION);
  const [replaceForgotPasswordMutation] = useMutation(REPLACE_FORGOT_PASSWORD_MUTATION);
  const [resendVerificationOtpMutation] = useMutation(RESEND_VERIFICATION_OTP_MUTATION);

  const register = async (input: RegisterInput) => {
    const { data } = await registerMutation({
      variables: { createUserInput: input },
    });
    return data.register;
  };

  const verifyAccount = async (input: VerificationInput) => {
    const { data } = await verifyAccountMutation({
      variables: { verificationFields: input },
    });
    return data.verifyAccount;
  };

  const login = async (input: LoginInput) => {
    const { data } = await loginMutation({
      variables: { loginInput: input },
    });
    return data.login;
  };

  const verifyLogin = async (input: VerificationInput) => {
    const { data } = await verifyLoginMutation({
      variables: { verifyLoginInput: input },
    });

    if (data.verifyLogin.status === 'success') {
      await AsyncStorage.setItem('accessToken', data.verifyLogin.accessToken);
      await AsyncStorage.setItem('refreshToken', data.verifyLogin.refreshToken);
    }

    return data.verifyLogin;
  };

  const forgetPassword = async (email: string) => {
    const { data } = await forgetPasswordMutation({
      variables: { userEmail: email },
    });
    return data.forgetPassword;
  };

  const verifyPasswordForget = async (input: VerificationInput) => {
    const { data } = await verifyPasswordForgetMutation({
      variables: { verificationFields: input },
    });
    return data.verifyPasswordForget;
  };

  const replaceForgotPassword = async (input: NewPasswordInput) => {
    const { data } = await replaceForgotPasswordMutation({
      variables: { newPasswordInput: input },
    });
    return data.replaceForgotPassword;
  };

  const resendVerificationOtp = async (email: string) => {
    const { data } = await resendVerificationOtpMutation({
      variables: { email },
    });
    return data.resendVerificationOtp;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    router.replace('/(auth)/login');
  };

  return {
    register,
    verifyAccount,
    login,
    verifyLogin,
    forgetPassword,
    verifyPasswordForget,
    replaceForgotPassword,
    resendVerificationOtp,
    logout,
  };
}