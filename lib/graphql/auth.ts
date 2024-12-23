// lib/graphql/auth.ts
import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($createUserInput: RegistrationInput!) {
    register(createUserInput: $createUserInput) {
      message
      status
    }
  }
`;

export const VERIFY_ACCOUNT_MUTATION = gql`
  mutation VerifyAccount($verificationFields: VerificationInput!) {
    verifyAccount(verificationFields: $verificationFields) {
      message
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      message
      status
    }
  }
`;

export const VERIFY_LOGIN_MUTATION = gql`
  mutation VerifyLogin($verifyLoginInput: VerifyLoginInput!) {
    verifyLogin(verifyLoginInput: $verifyLoginInput) {
      message
      status
      accessToken
      refreshToken
    }
  }
`;

export const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPassword($userEmail: String!) {
    forgetPassword(userEmail: $userEmail) {
      message
      status
    }
  }
`;

export const VERIFY_PASSWORD_FORGET_MUTATION = gql`
  mutation VerifyPasswordForget($verificationFields: VerificationInput!) {
    verifyPasswordForget(verificationFields: $verificationFields) {
      message
      status
      verificationToken
    }
  }
`;

export const REPLACE_FORGOT_PASSWORD_MUTATION = gql`
  mutation ReplaceForgotPassword($newPasswordInput: NewPasswordInput!) {
    replaceForgotPassword(newPasswordInput: $newPasswordInput) {
      message
      status
    }
  }
`;

export const RESEND_VERIFICATION_OTP_MUTATION = gql`
  mutation ResendVerificationOtp($email: String!) {
    resendVerificationOtp(email: $email) {
      message
      status
    }
  }
`;