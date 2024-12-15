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
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const NavigationBar = () => {
  const navigation = useNavigation();
  const [isCartVisible, setCartVisible] = useState(false);
  const {
    addToCart,
    clearCart,
    cartItems,
    decreaseFromCart,
    removeFromCart,
    cartTotalPrice,
    orderHistory,
    setOrderHistory,
    clearComboSelection,
  } = useCart();
  const [isOrderHistoryVisible, setOrderHistoryVisible] = useState(false); // 控制历史订单弹框显示

  // const orderHistory = [
  //   {
  //     orderId: "#002",
  //     orderTime: "00:10",
  //     items: [
  //       { name: "Superior Beef Slice", quantity: 1, amount: 12 },
  //       { name: "Superior Beef Slice", quantity: 1, amount: 5.99 },
  //     ],
  //     orderTotal: 17.99,
  //   },
  //   {
  //     orderId: "#001",
  //     orderTime: "00:00",
  //     items: [
  //       { name: "Superior Beef Slice", quantity: 1, amount: 15 },
  //       { name: "Superior Beef Slice", quantity: 1, amount: 123.66 },
  //     ],
  //     orderTotal: 17.99,
  //   },
  // ];

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

  const handleSubmitOrder = () => {
    setCartVisible(false);
    Toast.show({
      type: "success",
      text1: `Submit order success`,
    });
    setOrderHistory((prev) => {
      const newOrder = {
        orderId: `#${prev.length + 1}`,
        orderTime: new Date().toLocaleTimeString(),
        items: cartItems.map((item) => {
          if (item.isCombo) {
            return {
              name: item.combo.name + "/" + item.combo.nameCN,
              quantity: 1,
              amount: item.price.toFixed(2),
            };
          } else {
            return {
              name: item.name + "/" + item.nameCN,
              quantity: item.quantity,
              amount: (item.price * item.quantity).toFixed(2),
            };
          }
        }),
        orderTotal: cartTotalPrice,
      };
      console.log("====newOrder====", JSON.stringify(newOrder));
      return [newOrder, ...prev];
    });
    clearCart();
    clearComboSelection();
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

  // const renderCartItem = ({ item }) => {
  //   if (item.combo) {
  //     // Render combo item
  //     return (
  //       <View style={styles.cartComboItem}>
  //         <Text style={styles.comboName}>
  //           {item.combo.name} / {item.combo.nameCN} - ${item.price.toFixed(2)}
  //         </Text>
  //         <Text style={styles.comboDetails}>
  //           {`Broth: ${item.broth[0]?.name} / ${item.broth[0]?.nameCN} `}
  //           {item.meats.map(
  //             (meat, index) =>
  //               `+ Meat${index + 1}: ${meat.name} / ${meat.nameCN} `
  //           )}
  //           {item.vegetables.map(
  //             (veg, index) => `+ Veg${index + 1}: ${veg.name} / ${veg.nameCN} `
  //           )}
  //           {`+ Staple: ${item.staple[0]?.name} / ${item.staple[0]?.nameCN}`}
  //         </Text>
  //         <View style={styles.comboActions}>
  //           <TouchableOpacity style={styles.editButton}>
  //             <Text style={styles.editButtonText}>Edit</Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             style={styles.deleteButton}
  //             onPress={() => removeFromCart(item.id)}
  //           >
  //             <Text style={styles.deleteButtonText}>Delete</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     );
  //   }

  //   // Render individual item
  //   return (
  //     <View style={styles.cartItem}>
  //       <TouchableOpacity onPress={() => removeFromCart(item.id)}>
  //         <Text style={styles.deleteButton}>×</Text>
  //       </TouchableOpacity>
  //       <Text style={styles.itemName}>
  //         {item.name}/{item.nameCN}
  //       </Text>

  //       <View style={styles.quantityContainer}>
  //         <TouchableOpacity onPress={() => decreaseFromCart(item.id)}>
  //           <Text style={styles.decrementButton}>-</Text>
  //         </TouchableOpacity>
  //         <TextInput
  //           style={styles.quantityInput}
  //           value={String(item.quantity)}
  //           keyboardType="numeric"
  //           onChangeText={(value) => {
  //             const parsedValue = parseInt(value, 10);
  //             if (!isNaN(parsedValue)) {
  //               handleQuantityChange(item, parsedValue);
  //             }
  //           }}
  //         />
  //         <TouchableOpacity onPress={() => addToCart(item)}>
  //           <Text style={styles.incrementButton}>+</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <Text style={styles.itemTotal}>
  //         ${(item.price * item.quantity).toFixed(2)}
  //       </Text>
  //     </View>
  //   );
  // };

  //new
  const renderCartItem = ({ item }) => {
    if (item.combo) {
      // Render combo item
      return (
        <View style={styles.cartComboItem}>
          <Text style={styles.comboName}>
            {item.combo.name} / {item.combo.nameCN} - ${item.price.toFixed(2)}
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
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
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
        <View style={styles.cartItemContent}>
          <Text style={styles.itemName}>
            {item.name} / {item.nameCN}
          </Text>
          <Text style={styles.itemPrice}>
            ${item.price ? item.price.toFixed(2) : "0.00"}
          </Text>
          <Text style={styles.itemTotal}>
            Total: ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
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
      </View>
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <Text style={styles.orderTime}>Time: {item.orderTime}</Text>
        <Text style={styles.orderTotal}>
          Total: ${item.orderTotal.toFixed(2)}
        </Text>
      </View>
      <FlatList
        data={item.items}
        renderItem={({ item }) => (
          <View>
            <View style={styles.orderDetails}>
              <Text style={styles.detailQty}>{item.quantity}</Text>
              <Text style={styles.detailName}>{item.name}</Text>
              <Text style={styles.detailAmount}>${item.amount}</Text>
            </View>
            <View style={styles.itemDivider} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.detailQty}>Qty</Text>
              <Text style={styles.detailName}>Name</Text>
              <Text style={styles.detailAmount}>Amount</Text>
            </View>
            <View style={styles.headerDivider} />
          </View>
        )}
      />
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
          <TouchableOpacity onPress={() => navigation.navigate("index")}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </TouchableOpacity>
        </View>
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
            <View>
              <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>

            <Text style={styles.totalAmount}>
              Total Amount: ${cartTotalPrice.toFixed(2)}
            </Text>
            <>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCartVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitOrderButton}
                onPress={() => handleSubmitOrder(false)}
              >
                <Text style={styles.closeButtonText}>Submit Order</Text>
              </TouchableOpacity>
            </>
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
            <View>
              <FlatList
                data={orderHistory}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

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
    backgroundColor: "#295272",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 左右布局
    paddingHorizontal: 10,
    position: "relative", // 允许子元素绝对定位
  },
  logoContainer: {
    position: "absolute", // 绝对定位
    left: "52%", // 左侧距离占父容器宽度的 50%
    transform: [{ translateX: -50 }], // 使 logo 水平居中
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
    width: "95%", // 根据平台动态设置宽度
    height: "auto", // 限制高度，避免内容溢出屏幕
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center", // 居中对齐
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
    justifyContent: "space-between",
  },
  cartItemContent: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    flexWrap: "wrap",
    wordWrap: "break-word",
    maxWidth: "100%",
  },

  itemPrice: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },

  itemTotal: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 5,
    textAlign: "center",
    width: 30,
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
    color: "#f44336",
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: "center",
  },
  submitOrderButton: {
    backgroundColor: "#295272",
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
    fontSize: 16,
    color: "#555", // 时间的灰色显示
    fontWeight: "bold",
    textAlign: "center",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
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
    backgroundColor: "#295272",
    padding: 5,
    borderRadius: 5,
    color: "#fff",
  },
  editButtonText: {
    color: "#fff",
  },
  deleteButtonText: {
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 5,
    color: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  headerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    marginBottom: 10,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
  },
  // orderTotal: {
  //   marginTop: 10,
  //   fontWeight: "bold",
  //   textAlign: "right",
  // },
});
