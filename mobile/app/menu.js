import React, { use } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { getMenuitems, getCategories, getMenuitem } from "../utils/api";
import { useCart } from "./context/cartContext";
import Toast from "react-native-toast-message";

export default function Menu() {
  //菜单数据
  const [menuData, setMenuData] = useState([]);
  //分类数据
  const [categories, setCategories] = useState([]);
  //已选择的一级分类
  const [selectedCategory, setSelectedCategory] = useState(0);
  //已选择的二级分类
  const [selectedSubCategories, setSelectedSubCategories] = useState([0]);

  //Combo相关变量
  const [isComboPage, setIsComboPage] = useState(false);
  const [comboListVisible, setComboListVisible] = useState(true);
  const [comboDetailsVisible, setComboDetailsVisible] = useState(false);
  const [comboItemLimits, setComboItemLimits] = useState({
    broth: 1,
    meats: 4,
    vegetables: 4,
    staple: 1,
  });

  const [editIndex, setEditIndex] = useState(null); // Keep track of the slot being edited

  const [ComboItemSelectModalVisible, setComboItemSelectModalVisible] =
    useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("");

  const sampleData = {
    broth: [
      {
        id: 1,
        name: "Chicken Broth",
        nameCN: "秦氏三鲜锅",
        price: 0.0,
        image: require("../assets/broth1.png"), // Placeholder 图片
      },
      {
        id: 2,
        name: "Variety Mushroom",
        nameCN: "高山野生菌锅",
        price: 3.0,
        image: require("../assets/broth1.png"),
      },
      {
        id: 3,
        name: "Chine's Legendary Spicy Broth",
        nameCN: "秦氏牛油火锅",
        price: 3.0,
        image: require("../assets/broth1.png"),
      },
      {
        id: 4,
        name: "Specialty Tomato Broth",
        nameCN: "养颜番茄锅",
        price: 3.0,
        image: require("../assets/broth1.png"),
      },
    ],
    vege: [
      {
        id: 5,
        name: "Spinach",
        nameCN: "菠菜",
        price: 2.25,
        image: require("../assets/vegetable.png"), // Placeholder 图片
      },
      {
        id: 6,
        name: "Cabbage",
        nameCN: "大白菜",
        price: 0.0,
        image: require("../assets/vegetable.png"),
      },
      {
        id: 7,
        name: "Lettuce",
        nameCN: "唐生菜",
        price: 0.0,
        image: require("../assets/vegetable.png"),
      },
      {
        id: 8,
        name: "Bean Sprout",
        nameCN: "豆芽",
        price: 0.0,
        image: require("../assets/vegetable.png"),
      },
      {
        id: 9,
        name: "Broccoli",
        nameCN: "西蓝花",
        price: 0.0,
        image: require("../assets/vegetable.png"),
      },
    ],
    meat: [
      {
        id: 10,
        name: "Tenderloin Pork Slice",
        nameCN: "老肉片",
        price: 0.0,
        image: require("../assets/meat.png"),
      },
      {
        id: 11,
        name: "Chicken Slice",
        nameCN: "鸡肉片",
        price: 0.0,
        image: require("../assets/meat.png"),
      },
      {
        id: 12,
        name: "Beef Tripe",
        nameCN: "牛百叶",
        price: 0.0,
        image: require("../assets/meat.png"),
      },
      {
        id: 13,
        name: "Quail Egg",
        nameCN: "鹌鹑蛋",
        price: 0.0,
        image: require("../assets/meat.png"),
      },
      {
        id: 14,
        name: "Spam",
        nameCN: "午餐肉",
        price: 0.0,
        image: require("../assets/meat.png"),
      },
    ],
    main: [
      {
        id: 15,
        name: "Rice",
        nameCN: "米饭",
        price: 0.0,
        image: require("../assets/rice.png"), // Placeholder 图片
      },
      {
        id: 16,
        name: "Udon Noodels",
        nameCN: "乌冬面",
        price: 0.0,
        image: require("../assets/rice.png"),
      },
      {
        id: 17,
        name: "Ramen",
        nameCN: "日式拉面",
        price: 0.0,
        image: require("../assets/rice.png"),
      },
    ],
  };

  //open combo menuitem list
  const openModal = (type, index) => {
    setModalType(type); // Track the type (broth, meat, vegetable)
    setEditIndex(index); // Save the index of the slot being edited
    setModalData(sampleData); // Load modal data for the specific type
    setComboItemSelectModalVisible(true); // Open the modal
  };

  //cartContext全局变量
  const {
    addToCart,
    cartItems,
    decreaseFromCart,
    removeFromCart,
    quantities,
    setQuantities,
    comboSelection,
    setComboSelection,
    clearComboSelection,
    cartTotalPrice,
    setCartTotalPrice,
    cartStatus,
    setCartStatus,
  } = useCart();

  const increaseQuantity = (item) => {
    // setQuantities((prev) => ({ ...prev, [item.id]: prev[item.id] + 1 }));
    addToCart(item);
  };

  useEffect(() => {
    // console.log("quantities:" + JSON.stringify(quantities));
    // console.log("cartItems" + JSON.stringify(cartItems));
  }, [quantities]);

  useEffect(() => {
    console.log("-----Cart Items: ", cartItems);
  }, [cartItems]);

  useEffect(() => {
    calculateTotalPrice();
    updateCartStatus();
  }, [cartItems]);

  useEffect(() => {
    console.log("isComboPage:" + isComboPage);
    // console.log("cartItems" + JSON.stringify(cartItems));
  }, [isComboPage]);

  useEffect(() => {
    console.log("-----comboSelection" + JSON.stringify(comboSelection));
  }, [comboSelection]);

  const updateCartStatus = () => {
    let comboInCart = false;
    cartItems.forEach((item) => {
      if (item.isCombo) {
        comboInCart = true;
      }
    });
    setCartStatus({ ...cartStatus, comboInCart: comboInCart });
    console.log("cartStatus:" + JSON.stringify(cartStatus));
  };

  const decreaseQuantity = (item) => {
    // setQuantities((prev) => ({
    //   ...prev,
    //   [item.id]: prev[item.id] > 0 ? prev[item.id] - 1 : 0,
    // }));
    decreaseFromCart(item.id);
    // console.log(quantities);
    // console.log(cartItems);
  };

  const calculateTotalPrice = () => {
    const Sum = cartItems.reduce((acc, item) => {
      const price = typeof item?.price === "number" ? item.price : 0;
      const quantity = typeof item?.quantity === "number" ? item.quantity : 1;
      return acc + price * quantity;
    }, 0);
    setCartTotalPrice(Sum);
  };
  // 切换一级分类
  const handleCategoryChange = (index) => {
    setSelectedCategory(index);
    // 默认选中所有对应的二级分类
    setSelectedSubCategories([
      "All", // 添加 "All/全部"
      ...categories[index].subcategories.map((sub) => sub.id),
    ]);
    //刷新菜单列表
    // console.log("categories[index].id:", categories[index].id);
    fetchMenuData(categories[index].id);
    // 添加点击 Combo 筛选的逻辑
    if (categories[index].name === "Combo") {
      setIsComboPage(true);
    } else {
      setIsComboPage(false);
      setComboDetailsVisible(false);
    }
    setComboListVisible(true);
    setComboDetailsVisible(false);
    console.log(
      "===ComboItemSelectModalVisible:" +
        ComboItemSelectModalVisible +
        " comboDetailsVisible:" +
        comboDetailsVisible +
        " comboListVisible:" +
        comboListVisible +
        " isComboPage:" +
        isComboPage +
        " comboSelection.combo:" +
        comboSelection.combo +
        " " +
        JSON.stringify(comboSelection.combo)
    );
  };

  // 切换二级分类
  const handleSubCategoryChange = (subCategoryId) => {
    if (subCategoryId === "All") {
      // 如果点击 "All/全部"
      const allSelected =
        selectedSubCategories.length - 1 ===
        categories[selectedCategory].subcategories.length; // 检查是否所有其他二级分类已被选中
      if (allSelected) {
        return; // 已经全选，不做任何操作
      }
      // 否则选中 "All/全部" 和所有子分类
      setSelectedSubCategories([
        "All",
        ...categories[selectedCategory].subcategories.map((sub) => sub.id),
      ]);
      //刷新菜单列表
      fetchMenuData(categories[selectedCategory].id);
    } else {
      // 如果点击的是其他二级筛选项
      setSelectedSubCategories([subCategoryId]); // 只选择当前项
      //刷新菜单列表
      fetchMenuData(null, subCategoryId);
    }
  };

  function transformMenuData(menuData) {
    // 结果对象用于存储嵌套菜单
    const menuMap = {};

    // 遍历菜单数据，将每个项分类到一级或二级菜单
    menuData.forEach((menuItem) => {
      // 如果没有 parentID，则是一级菜单
      if (!menuItem.parentID) {
        menuMap[menuItem.id] = { ...menuItem, subcategories: [] };
      }
    });

    // 遍历菜单数据，将二级菜单放到一级菜单的 subcategories 中
    menuData.forEach((menuItem) => {
      if (menuItem.parentID && menuMap[menuItem.parentID]) {
        menuMap[menuItem.parentID].subcategories.push(menuItem);
      }
    });

    // 对一级菜单和二级菜单进行排序
    const sortedMenu = Object.values(menuMap)
      .sort((a, b) => a.sort_order - b.sort_order) // 一级菜单排序
      .map((menu) => {
        menu.subcategories = menu.subcategories.sort(
          (a, b) => a.sort_order - b.sort_order // 二级菜单排序
        );
        return menu;
      });

    return sortedMenu;
  }

  //处理combo锅底和菜品选择按钮
  const handleSelectItem = (item) => {
    if (modalType === "broth") {
      // Update the selected broth
      setComboSelection((prev) => {
        const updatedMeats = [...prev.broth];
        updatedMeats[editIndex] = item; // Update the correct slot
        return { ...prev, broth: updatedMeats };
      });
      // setComboSelection((prev) => ({ ...prev, broth: item }));
    } else if (modalType === "meat") {
      // Update the specific meat slot using editIndex
      setComboSelection((prev) => {
        const updatedMeats = [...prev.meats];
        updatedMeats[editIndex] = item; // Update the correct slot
        return { ...prev, meats: updatedMeats };
      });
    } else if (modalType === "vegetable") {
      // Update the specific vegetable slot using editIndex
      setComboSelection((prev) => {
        const updatedVegetables = [...prev.vegetables];
        updatedVegetables[editIndex] = item; // Update the correct slot
        return { ...prev, vegetables: updatedVegetables };
      });
    } else if (modalType === "staple") {
      // Update the selected staple
      setComboSelection((prev) => {
        const updatedMeats = [...prev.staple];
        updatedMeats[editIndex] = item; // Update the correct slot
        return { ...prev, staple: updatedMeats };
      });
      // setComboSelection((prev) => ({ ...prev, staple: item }));
    }

    // Close modal and reset editIndex
    setComboItemSelectModalVisible(false);
    setEditIndex(null);
  };

  const openComboModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setComboItemSelectModalVisible(true);
  };

  const handleSelectCombo = (item) => {
    console.log("====handleSelectCombo");
    // setComboSelection((prev) => ({ ...prev, combo: item }));
    setComboSelection((prev) => {
      return { ...prev, combo: item };
    });
    setComboDetailsVisible(true);
    setComboListVisible(false);
  };

  //combo详情页面,选择菜品和锅底
  const renderComboDetails = () => {
    const isComboComplete =
      comboSelection.broth.filter((m) => m).length === 1 &&
      comboSelection.meats.filter((m) => m).length === 4 &&
      comboSelection.vegetables.filter((v) => v).length === 4 &&
      comboSelection.staple.filter((m) => m).length === 1; // Check if all required items are selected

    const handleCancel = () => {
      clearComboSelection();
      setIsComboPage(true); // Return to the combo list
    };

    const handleAddComboToCart = () => {
      //calculate total price
      const totalPrice = calculateTotalComboPrice(comboSelection);
      // Add combo to the cart (example logic)
      const combo = {
        ...comboSelection,
        id: new Date().getTime(), // Unique ID for the combo
        price: totalPrice,
        isCombo: true,
      };
      //if combo is already in cart, remove it first
      // decreaseFromCart("combo");
      const action = cartStatus.comboInCart ? "Edit cart" : "Add to cart";
      addToCart(combo);
      Toast.show({
        type: "success",
        text1: `${action} success`,
      });
    };

    function calculateTotalComboPrice(comboSelection) {
      // 定义需要求和的属性名
      const keys = ["broth", "meats", "vegetables", "staple"];

      // 使用reduce对这些属性进行迭代求和
      let totalPrice = keys.reduce((sum, key) => {
        // 从comboSelection安全获取对应数组，如果不是数组则使用空数组代替
        const arr = Array.isArray(comboSelection?.[key])
          ? comboSelection[key]
          : [];

        // 对数组中每个元素的price求和，确保price为数字类型，不是数字则视为0
        const keySum = arr.reduce((acc, item) => {
          const price = typeof item?.price === "number" ? item.price : 0;
          return acc + price;
        }, 0);

        return sum + keySum;
      }, 0);

      totalPrice += comboSelection.combo.price; // Add the combo price

      return totalPrice;
    }

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.comboDetails}>
          <Text style={styles.comboTitle}>{comboSelection.combo.name}</Text>
          <Text style={styles.comboSubtitle}>
            {comboSelection.combo.nameCN}
          </Text>

          {/* Broth Section */}
          <Text style={styles.comboSectionTitle}>
            Broth 鍋底 (Choose 1 選一)
          </Text>
          {Array(comboItemLimits.broth)
            .fill(0)
            .map((_, index) =>
              comboSelection.broth[index] ? (
                <View key={`broth-${index}`} style={styles.comboSelection}>
                  <Text style={styles.comboSelectedText}>
                    {comboSelection.broth[index].name} /{" "}
                    {comboSelection.broth[index].nameCN}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal("broth", 0)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      setComboSelection((prev) => {
                        const updatedBroth = [...prev.broth];
                        updatedBroth[index] = null;
                        return { ...prev, broth: updatedBroth };
                      })
                    }
                  >
                    <Text style={styles.deleteButtonText}>Del</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  key={`broth-${index}`}
                  style={styles.comboButton}
                  onPress={() => openModal("broth", 0)}
                >
                  <Text style={styles.comboButtonText}>Choose my Broth</Text>
                </TouchableOpacity>
              )
            )}

          {/* Meat Section */}
          <Text style={styles.comboSectionTitle}>
            Meat 肉类 (Choose 4 選四)
          </Text>
          {Array(comboItemLimits.meats)
            .fill(0)
            .map((_, index) =>
              comboSelection.meats[index] ? (
                <View key={`meat-${index}`} style={styles.comboSelection}>
                  <Text style={styles.comboSelectedText}>
                    {comboSelection.meats[index].name} /{" "}
                    {comboSelection.meats[index].nameCN}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal("meat", index)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      setComboSelection((prev) => {
                        const updatedMeats = [...prev.meats];
                        updatedMeats[index] = null;
                        return { ...prev, meats: updatedMeats };
                      })
                    }
                  >
                    <Text style={styles.deleteButtonText}>Del</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  key={`meat-${index}`}
                  style={styles.comboButton}
                  onPress={() => openModal("meat", index)}
                >
                  <Text style={styles.comboButtonText}>
                    Choose my {index + 1} Meat
                  </Text>
                </TouchableOpacity>
              )
            )}

          {/* Vegetable Section */}
          <Text style={styles.comboSectionTitle}>
            Vegetable 素菜 (Choose 4 選四)
          </Text>
          {Array(comboItemLimits.vegetables)
            .fill(0)
            .map((_, index) =>
              comboSelection.vegetables[index] ? (
                <View key={`vegetable-${index}`} style={styles.comboSelection}>
                  <Text style={styles.comboSelectedText}>
                    {comboSelection.vegetables[index].name} /{" "}
                    {comboSelection.vegetables[index].nameCN}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal("vegetable", index)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      setComboSelection((prev) => {
                        const updatedVegetables = [...prev.vegetables];
                        updatedVegetables[index] = null;
                        return { ...prev, vegetables: updatedVegetables };
                      })
                    }
                  >
                    <Text style={styles.deleteButtonText}>Del</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  key={`vegetable-${index}`}
                  style={styles.comboButton}
                  onPress={() => openModal("vegetable", index)}
                >
                  <Text style={styles.comboButtonText}>
                    Choose my {index + 1} Vegetable
                  </Text>
                </TouchableOpacity>
              )
            )}

          {/* Staple Section */}
          <Text style={styles.comboSectionTitle}>
            Staple 主食 (Choose 1 選一)
          </Text>
          {Array(comboItemLimits.staple ? comboItemLimits.staple : 1)
            .fill(0)
            .map((_, index) =>
              comboSelection.staple[index] ? (
                <View key={`staple-${index}`} style={styles.comboSelection}>
                  <Text style={styles.comboSelectedText}>
                    {comboSelection.staple[index].name} /{" "}
                    {comboSelection.staple[index].nameCN}
                  </Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal("staple", 0)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      setComboSelection((prev) => {
                        const updatedStaple = [...prev.staple];
                        updatedStaple[index] = null;
                        return { ...prev, staple: updatedStaple };
                      })
                    }
                  >
                    <Text style={styles.deleteButtonText}>Del</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  key={`staple-${index}`}
                  style={styles.comboButton}
                  onPress={() => openModal("staple", index)}
                >
                  <Text style={styles.comboButtonText}>Choose my Staple</Text>
                </TouchableOpacity>
              )
            )}
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                !isComboComplete && styles.addToCartButtonDisabled,
              ]}
              onPress={() => {
                if (!isComboComplete) {
                  const action = cartStatus.comboInCart
                    ? "editing cart"
                    : "adding to Cart";
                  // 弹出提示信息
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: `You need to select all the items before ${action}`,
                    position: "top",
                  });
                } else {
                  // 执行加入购物车的逻辑
                  handleAddComboToCart();
                }
              }}
            >
              <Text style={styles.addToCartButtonText}>
                {cartStatus.comboInCart ? "Edit Cart" : "Add to Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  //combo选择菜品和锅底的弹框列表
  const renderModalItem = ({ item }) => (
    <View style={styles.modalItem}>
      <Image source={item.image} style={styles.modalItemImage} />
      <View style={styles.modalItemContent}>
        <Text style={styles.modalItemName}>
          {item.name} / {item.nameCN}
        </Text>
        <Text style={styles.modalItemPrice}>+${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => handleSelectItem(item)}
      >
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );

  //regular menuItem list
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.nameCN}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.quantity}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item)}
          >
            <Text style={styles.quantityIcon}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>
            {quantities[item.id] ? quantities[item.id] : 0}
          </Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              increaseQuantity(item);
            }}
          >
            <Text style={styles.quantityIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // const renderComboItem = ({ item }) => (
  //   <View style={styles.card}>
  //     <View style={styles.cardContent}>
  //       <View>
  //         <Text style={styles.itemName}>{item.name}</Text>
  //         <Text style={styles.itemDescription}>{item.nameCN}</Text>
  //       </View>
  //       <Text style={styles.itemPrice}>${item.price}</Text>
  //     </View>
  //     <View style={styles.actions}>
  //       <View style={styles.quantity}>
  //         <TouchableOpacity
  //           style={styles.quantityButton}
  //           onPress={() => decreaseQuantity(item)}
  //         >
  //           <Text style={styles.quantityIcon}>-</Text>
  //         </TouchableOpacity>
  //         <Text style={styles.quantityValue}>{quantities[item.id]}</Text>
  //         <TouchableOpacity
  //           style={styles.quantityButton}
  //           onPress={() => {
  //             increaseQuantity(item);
  //           }}
  //         >
  //           <Text style={styles.quantityIcon}>+</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // );

  const fetchData = async () => {
    try {
      const categoriesResult = await getCategories();
      if (categoriesResult.status && categoriesResult.data) {
        // console.log("categoriesResult=======", categoriesResult.data);
        const transformedCategoriesResult = transformMenuData(
          categoriesResult.data.rows
        );
        console.log(
          "transformedCategoriesResult:",
          transformedCategoriesResult
        );
        // console.log(JSON.stringify(transformedCategoriesResult));
        setCategories(transformedCategoriesResult);
      }
    } catch (error) {
      console.error("error in fetching tasks", error);
    }
  };

  //根据一级分类和二级分类获取菜单数据
  const fetchMenuData = async (categoryid, subcategoryid) => {
    const menuitemsResult = await getMenuitem(categoryid, subcategoryid);

    if (menuitemsResult) {
      // console.log("menuitemsResult:------", menuitemsResult);
      setMenuData(menuitemsResult);
      const cartItemsMap = transformArrayToObject(cartItems);
      setQuantities(
        menuitemsResult.reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: cartItemsMap[item.id] ? cartItemsMap[item.id] : 0,
          }),
          {}
        )
      );
    }
  };

  const transformArrayToObject = (array) => {
    return array.reduce((result, item) => {
      result[item.id] = item.quantity;
      return result;
    }, {});
  };

  useEffect(() => {
    // console.log("State updated, menuData:", menuData);
  }, [menuData]);

  useEffect(() => {
    fetchData();
  }, []);

  // 数据加载后，设置默认选项
  useEffect(() => {
    if (categories.length > 0) {
      handleCategoryChange(0); // 默认选择第一个一级分类及其所有二级分类
    }
  }, [categories]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {/* 一级筛选 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.filterRow}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  selectedCategory === index && styles.activeFilter,
                ]}
                onPress={() => handleCategoryChange(index)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === index && styles.activeFilterText,
                  ]}
                >
                  {category.name}/ {category.nameCN}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* 二级筛选 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.filterRow}>
            {/* "All/全部" 按钮 */}
            <TouchableOpacity
              key="All"
              style={[
                styles.filterButton,
                selectedSubCategories.includes("All") && styles.activeFilter,
              ]}
              onPress={() => handleSubCategoryChange("All")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSubCategories.includes("All") &&
                    styles.activeFilterText,
                ]}
              >
                All/全部
              </Text>
            </TouchableOpacity>

            {/* 其他二级分类按钮 */}
            {categories[selectedCategory] &&
              categories[selectedCategory]["subcategories"].map(
                (subCategory) => (
                  <TouchableOpacity
                    key={subCategory.id}
                    style={[
                      styles.filterButton,
                      selectedSubCategories.includes(subCategory.id) &&
                        styles.activeFilter,
                    ]}
                    onPress={() => handleSubCategoryChange(subCategory.id)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedSubCategories.includes(subCategory.id) &&
                          styles.activeFilterText,
                      ]}
                    >
                      {subCategory.name} / {subCategory.nameCN}
                    </Text>
                  </TouchableOpacity>
                )
              )}
          </View>
        </ScrollView>
      </View>

      {/* Combo list page */}
      {isComboPage ? (
        !comboSelection.combo && (
          <FlatList
            visible={false}
            data={menuData}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemName}>{item.nameCN}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemDescription}>{item.descriptionCN}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleSelectCombo(item)}
                >
                  <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )
      ) : (
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {/* Combo Details pop-up */}
      {isComboPage && comboSelection.combo && renderComboDetails()}

      {/* combo 菜品选择弹框 */}
      <Modal visible={ComboItemSelectModalVisible} animationType="none">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === "broth"
              ? "Broth 鍋底"
              : modalType === "meat"
              ? "Meat 肉"
              : modalType === "vegetable"
              ? "Vegetable 素菜"
              : "Staple 主食"}
          </Text>
          <FlatList
            data={
              modalType === "broth"
                ? modalData.broth
                : modalType === "meat"
                ? modalData.meat
                : modalType === "vegetable"
                ? modalData.vege
                : modalData.main
            }
            renderItem={renderModalItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setComboItemSelectModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  filterContainer: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  scrollViewContainer: {
    alignItems: "center", // 确保内容垂直居中
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 5, // 保持两侧内间距
    height: 40, // 设置行高，避免文字被裁剪
    alignItems: "center", // 垂直居中
  },
  filterButton: {
    paddingVertical: 5, // 增加上下内边距，确保文字不被裁剪
    paddingHorizontal: 5, // 左右间距保持
    backgroundColor: "#ddd",
    borderRadius: 5, // 圆角更柔和
    marginHorizontal: 3, // 增加按钮间距
  },
  activeFilter: {
    backgroundColor: "#0f8024",
  },
  filterText: {
    fontSize: 16,
    color: "#555",
  },
  activeFilterText: {
    color: "#fff",
  },
  listContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  // cardContent: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 12,
  // },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // Allow the entire row to wrap when needed
    paddingBottom: 10, // Add some padding to avoid text overlap
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    flexWrap: "wrap", // Allow text to wrap
    maxWidth: "100%", // Limit width to 70% of the container to accommodate the price
    marginRight: 10, // Add some spacing from the price
  },

  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right", // Ensure the text aligns to the right
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    backgroundColor: "#295272",
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: 40,
  },
  comboDetails: { padding: 20 },
  comboTitle: { fontSize: 20, fontWeight: "bold" },
  comboSubtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  comboSectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  comboButton: { backgroundColor: "#ddd", padding: 10, marginBottom: 5 },
  comboButtonText: { fontSize: 16 },

  modalContent: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  modalItemImage: { width: 50, height: 50, marginRight: 10 },
  modalItemContent: { flex: 1 },
  modalItemName: { fontSize: 16, fontWeight: "bold" },
  modalItemPrice: { fontSize: 14, color: "#666" },
  selectButton: {
    backgroundColor: "#295272",
    padding: 5,
    borderRadius: 5,
  },
  selectButtonText: { color: "#fff", fontSize: 14 },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  comboSelection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },

  comboSelectedText: {
    flex: 1,
    fontSize: 16,
  },

  editButton: {
    backgroundColor: "#295272",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  addToCartButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  addToCartButtonDisabled: {
    backgroundColor: "#aaa", // Gray out when disabled
  },

  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
