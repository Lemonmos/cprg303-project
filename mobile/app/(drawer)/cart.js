import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CartContent() {
  const cartItems = [
    {
      id: 1,
      name: "Name",
      description: "Description (Optional)",
      price: "$ Price",
      qty: 1,
    },
    {
      id: 2,
      name: "Name",
      description: "Description (Optional)",
      price: "$ Price",
      qty: 1,
    },
    {
      id: 3,
      name: "Name",
      description: "Description (Optional)",
      price: "$ Price",
      qty: 1,
    },
  ];

  return (
    <View style={styles.container}>
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>
          <MaterialIcons name="table-restaurant" size={18} color="#000" />{" "}
          Table: T1-1
        </Text>
      </View>

      {/* 菜单项列表 */}
      <ScrollView style={styles.menuList}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <Text style={styles.menuItemPrice}>{item.price}</Text>
            </View>
            <View style={styles.menuItemActions}>
              <TouchableOpacity style={styles.requestButton}>
                <Text style={styles.requestButtonText}>Request</Text>
              </TouchableOpacity>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton}>
                  <MaterialIcons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.qty}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.previousOrderButton}>
          <Text style={styles.footerButtonText}>Previous Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitOrderButton}>
          <Text style={styles.footerButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    marginHorizontal: 30,
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  menuList: {
    flex: 1,
    padding: 10,
  },
  menuItem: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemInfo: {
    flex: 3,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  menuItemActions: {
    flex: 1,
    alignItems: "center",
  },
  requestButton: {
    backgroundColor: "#3498db",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    padding: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  previousOrderButton: {
    flex: 1,
    backgroundColor: "#f1c40f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  submitOrderButton: {
    flex: 1,
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
