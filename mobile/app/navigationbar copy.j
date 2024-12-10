import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const NavigationBar = () => {
  const [isCartVisible, setCartVisible] = useState(false);

  // 示例购物车数据
  const cartItems = [
    {
      id: "1",
      name: "Cumin Flavored Meat Ball (5pcs)",
      price: 3.25,
      quantity: 2,
    },
    { id: "2", name: "Spinach (Small Basket)", price: 3.25, quantity: 2 },
    { id: "3", name: "Cabbage (Small Basket)", price: 3.25, quantity: 1 },
    { id: "4", name: "Lettuce (Small Basket)", price: 3.25, quantity: 1 },
    { id: "5", name: "Potato Slices (8pcs)", price: 3.25, quantity: 1 },
    { id: "6", name: "Taro Slice (8pcs)", price: 3.25, quantity: 2 },
  ];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>x {item.quantity}</Text>
        <Text style={styles.itemTotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View>
      {/* 顶部导航栏 */}
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <MaterialIcons name="update" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 16 }}>T1-1</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")} // 替换为实际的 Logo 文件路径
            style={styles.logo}
          />
        </View>
        {/* 按钮靠右 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setCartVisible(true)}>
            <MaterialIcons name="shopping-cart" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 购物车弹框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCartVisible}
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cart</Text>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
            />
            <Text style={styles.totalAmount}>
              Total Amount: ${totalAmount.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCartVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: "#2c3e50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  quantityContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
