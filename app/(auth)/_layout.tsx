import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-account" />
      <Stack.Screen name="verify-login" />
      <Stack.Screen name="verify-password-forget" />
      <Stack.Screen name="replace-password" />
      <Stack.Screen name="verify-password-reset" />
    </Stack>
  );
}