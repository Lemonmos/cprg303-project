import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // const [cartItems, setCartItems] = useState(() => {
  //   const storedCart = localStorage.getItem("cartData");
  //   return storedCart ? JSON.parse(storedCart) : [];
  // });

  const [quantities, setQuantities] = useState({});

  const [comboSelection, setComboSelection] = useState({
    combo: null,
    broth: [],
    meats: [],
    vegetables: [],
    staple: [],
    price: 0,
  });

  const [cartTotalPrice, setCartTotalPrice] = useState(0);

  const [cartStatus, setCartStatus] = useState({ comboInCart: false });

  const [orderHistory, setOrderHistory] = useState([]);

  // Load cart data from AsyncStorage when the app starts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cartData");
        console.log("storedCart:" + JSON.stringify(storedCart));
        if (storedCart && Array.isArray(JSON.parse(storedCart))) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart data", error);
      }
    };

    loadCart();
  }, []);

  // Save cart data to AsyncStorage when cartItems changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cartData", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart data", error);
      }
    };

    saveCart();
  }, [cartItems]);

  const addToCart = (item) => {
    console.log("item++++++");
    console.log(item);
    console.log("cartItems" + cartItems);
    if (!Array.isArray(cartItems)) {
      console.error("cartItems is not an array:", cartItems);
      return;
    }

    // If the item is a combo, remove existing combo and add the new one
    if (item.isCombo) {
      setCartItems((prevCartItems) => {
        // Remove existing combo and add the new one
        return [...prevCartItems.filter((item) => !item.isCombo), item];
      });
      return;
    }

    const existingItem = cartItems.find((i) => i.id === item.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    setCartItems(updatedCart);
    setQuantities((prev) => ({ ...prev, [item.id]: prev[item.id] + 1 }));
    // localStorage.setItem("cartData", JSON.stringify(updatedCart));
    console.log("cartItems" + JSON.stringify(cartItems));
  };

  const decreaseFromCart = (id) => {
    if (id && id === "combo") {
      // debugger;
      const existingItem = cartItems.find((i) => i.isCombo);
      if (existingItem) {
        let updatedCart;
        updatedCart = cartItems.filter((i) => !i.isCombo);
        setCartItems(updatedCart);
      }
      return;
    }
    const existingItem = cartItems.find((i) => i.id === id);
    if (existingItem) {
      let updatedCart;
      if (existingItem.quantity > 1) {
        updatedCart = cartItems.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        // 如果数量减少到 0，移除该商品
        updatedCart = cartItems.filter((i) => i.id !== id);
      }
      setCartItems(updatedCart);
      setQuantities((prev) => ({
        ...prev,
        [id]: prev[id] > 0 ? prev[id] - 1 : 0,
      }));
      // localStorage.setItem("cartData", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((i) => i.id !== id);
    setCartItems(updatedCart);
    setQuantities((prev) => ({ ...prev, [id]: 0 }));
    // localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    setQuantities({});
    AsyncStorage.removeItem("cartData");
    // localStorage.removeItem("cartData");
  };

  const clearComboSelection = () => {
    setComboSelection({
      combo: null,
      broth: [],
      meats: [],
      vegetables: [],
      staple: [],
      price: 0,
    });
  };

  const editComboSelection = (selection) => {
    setComboSelection(selection);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseFromCart,
        clearCart,
        quantities,
        setQuantities,
        comboSelection,
        setComboSelection,
        clearComboSelection,
        editComboSelection,
        cartTotalPrice,
        setCartTotalPrice,
        cartStatus,
        setCartStatus,
        orderHistory,
        setOrderHistory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
