import { StyleSheet } from "react-native";
import React from "react";
import Menu from "./menu";
import NavigationBar from "./navigationbar";
import { CartProvider } from "./context/cartContext";

const Order = () => {
  return (
    <CartProvider>
      <NavigationBar />
      <Menu />
    </CartProvider>
  );
};

export default Order;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
  },
});
