import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "./context/cartContext";

const NavigationBar = () => {
  const [isCartVisible, setCartVisible] = useState(false);
  const { addToCart, cartItems, decreaseFromCart, removeFromCart } = useCart();
  const [isOrderHistoryVisible, setOrderHistoryVisible] = useState(false); // 控制历史订单弹框显示

  const totalAmount = 1;
  const orderHistory = [
    {
      orderId: "#002",
      orderTime: "00:10",
      items: [
        { name: "Superior Beef Slice", quantity: 1, amount: 12 },
        { name: "Superior Beef Slice", quantity: 1, amount: 5.99 },
      ],
      orderTotal: 17.99,
    },
    {
      orderId: "#001",
      orderTime: "00:00",
      items: [
        { name: "Superior Beef Slice", quantity: 1, amount: 15 },
        { name: "Superior Beef Slice", quantity: 1, amount: 123.66 },
      ],
      orderTotal: 17.99,
    },
  ];

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else if (newQuantity > item.quantity) {
      addToCart({ ...item, quantity: newQuantity - item.quantity });
    } else if (newQuantity < item.quantity) {
      const decreaseCount = item.quantity - newQuantity;
      for (let i = 0; i < decreaseCount; i++) {
        decreaseFromCart(item.id);
      }
    }
  };

  // const renderCartItem = ({ item }) => (
  //   <View style={styles.cartItem}>
  //     <TouchableOpacity onPress={() => removeFromCart(item.id)}>
  //       <Text style={styles.deleteButton}>×</Text>
  //     </TouchableOpacity>
  //     <Text style={styles.itemName}>
  //       {item.name}/{item.nameCN}
  //     </Text>
  //     <Text style={styles.itemPrice}>
  //       ${item.price ? item.price.toFixed(2) : 0.0}
  //     </Text>
  //     <View style={styles.quantityContainer}>
  //       <TouchableOpacity onPress={() => decreaseFromCart(item.id)}>
  //         <Text style={styles.decrementButton}>-</Text>
  //       </TouchableOpacity>
  //       <TextInput
  //         style={styles.quantityInput}
  //         value={String(item.quantity)}
  //         keyboardType="numeric"
  //         onChangeText={(value) => {
  //           const parsedValue = parseInt(value, 10);
  //           if (!isNaN(parsedValue)) {
  //             handleQuantityChange(item, parsedValue);
  //           }
  //         }}
  //       />
  //       <TouchableOpacity onPress={() => addToCart(item)}>
  //         <Text style={styles.incrementButton}>+</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <Text style={styles.itemTotal}>
  //       ${(item.price * item.quantity).toFixed(2)}
  //     </Text>
  //   </View>
  // );

  const renderCartItem = ({ item }) => {
    if (item.combo) {
      // Render combo item
      return (
        <View style={styles.cartComboItem}>
          <Text style={styles.comboName}>
            {item.combo.name} / {item.combo.nameCN} - $
            {item.totalPrice.toFixed(2)}
          </Text>
          <Text style={styles.comboDetails}>
            {`Broth: ${item.broth[0]?.name} / ${item.broth[0]?.nameCN} `}
            {item.meats.map(
              (meat, index) =>
                `+ Meat${index + 1}: ${meat.name} / ${meat.nameCN} `
            )}
            {item.vegetables.map(
              (veg, index) => `+ Veg${index + 1}: ${veg.name} / ${veg.nameCN} `
            )}
            {`+ Staple: ${item.staple[0]?.name} / ${item.staple[0]?.nameCN}`}
          </Text>
          <View style={styles.comboActions}>
            <TouchableOpacity style={styles.editButton}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Render individual item
    return (
      <View style={styles.cartItem}>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.deleteButton}>×</Text>
        </TouchableOpacity>
        <Text style={styles.itemName}>
          {item.name}/{item.nameCN}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseFromCart(item.id)}>
            <Text style={styles.decrementButton}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={String(item.quantity)}
            keyboardType="numeric"
            onChangeText={(value) => {
              const parsedValue = parseInt(value, 10);
              if (!isNaN(parsedValue)) {
                handleQuantityChange(item, parsedValue);
              }
            }}
          />
          <TouchableOpacity onPress={() => addToCart(item)}>
            <Text style={styles.incrementButton}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotal}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <Text style={styles.orderTime}>Order Time: {item.orderTime}</Text>
      </View>
      <FlatList
        data={item.items}
        renderItem={({ item }) => (
          <View style={styles.orderDetails}>
            <Text style={styles.detailQty}>{item.quantity}</Text>
            <Text style={styles.detailName}>{item.name}</Text>
            <Text style={styles.detailAmount}>${item.amount}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={styles.orderTotal}>
        Order Total: ${item.orderTotal.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View>
      {/* 顶部导航栏 */}
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setOrderHistoryVisible(true)}>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setCartVisible(true)}>
            <MaterialIcons name="shopping-cart" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 购物车弹框 */}
      {/* <Modal
        animationType="none"
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
      </Modal> */}

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
              keyExtractor={(item) => item.id.toString()}
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

      {/* 历史订单弹框 */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isOrderHistoryVisible}
        onRequestClose={() => setOrderHistoryVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Previous Orders</Text>
            <FlatList
              data={orderHistory}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOrderHistoryVisible(false)}
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
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 5,
    textAlign: "center",
    width: 50,
    marginHorizontal: 5,
  },
  incrementButton: {
    fontSize: 20,
    color: "green",
    marginLeft: 5,
  },
  decrementButton: {
    fontSize: 20,
    color: "blue",
    marginLeft: 5,
  },
  deleteButton: {
    fontSize: 20,
    color: "red",
    marginRight: 10,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  orderItem: {
    marginBottom: 20, // 每个订单之间的间距
  },
  orderHeader: {
    flexDirection: "row", // 横向排列
    justifyContent: "space-between", // 左右两端对齐
    alignItems: "center", // 垂直居中
    marginBottom: 10, // 与订单详情的间距
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold", // 订单号加粗
  },
  orderTime: {
    fontSize: 14,
    color: "#555", // 时间的灰色显示
    marginBottom: 10, // 时间与订单详情的间距
  },
  orderDetails: {
    flexDirection: "row", // 每条订单详情水平布局
    justifyContent: "space-between",
    marginBottom: 5, // 每个商品之间的间距
  },
  detailQty: {
    flex: 1,
    textAlign: "left", // 数量对齐到左边
  },
  detailName: {
    flex: 3,
    textAlign: "center", // 商品名称居中对齐
  },
  detailAmount: {
    flex: 1,
    textAlign: "right", // 金额对齐到右边
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "right",
  },
  cartComboItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  comboName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  comboDetails: {
    fontSize: 14,
    color: "#666",
  },
  comboActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4caf50",
    padding: 5,
    borderRadius: 5,
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 5,
    color: "#fff",
  },
});
