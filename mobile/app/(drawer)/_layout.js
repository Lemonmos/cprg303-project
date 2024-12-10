import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const _layout = () => {
  const router = useRouter(); // 使用 useRouter 来实现页面跳转

  return (
    <View style={{ flex: 1 }}>
      {/* 顶部导航栏 */}
      <View style={styles.topBar}>
        {/* <TouchableOpacity onPress={() => router.push("/(drawer)/_layout")}>
          <MaterialIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity> */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")} // 替换为实际的 Logo 文件路径
            style={styles.logo}
          />
        </View>
        {/* 按钮靠右 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <MaterialIcons name="shopping-cart" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <MaterialIcons name="shopping-cart" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer 菜单 */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerPosition: "left",
            drawerActiveTintColor: "green",
            drawerLabelStyle: { fontSize: 20, color: "black" },
            drawerStyle: { backgroundColor: "white" },
          }}
        >
          <Drawer.Screen
            name="broth"
            options={{
              title: "Broth",
            }}
          />
          <Drawer.Screen
            name="meat"
            options={{
              title: "Meat",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </View>
  );
};

export default _layout;

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: "#2c3e50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});
