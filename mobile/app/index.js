import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import NavigationBar from "./navigationbar";
import { CartProvider } from "./context/cartContext";
import { useNavigation } from "@react-navigation/native";

const LoginPage = ({ onLogin }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("order");
    // if (tableNumber && password) {
    //   onLogin(tableNumber); // 触发登录回调
    // } else {
    //   alert("Please enter both Table Number and Password.");
    // }
  };

  return (
    <>
      <NavigationBar />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.welcomeText}>
          Chine Legendary Hot Pot & Noodles!
        </Text>
        <Image source={require("../assets/Logo1.png")} style={styles.logo} />
        {/* <TextInput
          style={styles.input}
          placeholder="Table Number (e.g., T1-1)"
          value={tableNumber}
          onChangeText={setTableNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        /> */}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Start Order</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginPage;
