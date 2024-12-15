import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

import { CartProvider } from "./context/cartContext";

export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </CartProvider>
  );
}
