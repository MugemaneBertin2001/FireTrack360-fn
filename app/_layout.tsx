import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false  }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  );
}
