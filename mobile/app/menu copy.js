import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { getMenuitems, getCategories } from "../utils/api";
import NavigationBar from "./navigationbar";

// const menuData = [
//   {
//     id: "1",
//     name: "Broth 1",
//     description: "Description (Optional)",
//     price: "$5.00",
//   },
//   {
//     id: "3",
//     name: "Broth 3",
//     description: "Description (Optional)",
//     price: "$7.00",
//   },
// ];

// 示例数据
// const categories = {
//   Appetizers: [
//     "Spring Rolls",
//     "Garlic Bread",
//     "Salad",
//     "Spring Rolls1",
//     "Garlic Bread1",
//     "Salad1",
//     "Spring Rolls2",
//     "Garlic Bread2",
//     "Salad2",
//   ],
//   Mains: ["Steak", "Burger", "Pizza"],
//   Drinks: ["Coke", "Juice", "Wine"],
//   Desserts: ["Ice Cream", "Cake", "Cookies"],
//   Desserts1: ["Ice Cream1", "Cake1", "Cookies1"],
//   Desserts2: ["Ice Cream2", "Cake2", "Cookies2"],
//   Desserts3: ["Ice Cream2", "Cake2", "Cookies2"],
// };

export default function Menu() {
  //菜单数据
  const [menuData, setMenuData] = useState([]);
  //购物车数据
  const [cartItems, setCartItems] = useState([]);
  //分类数据
  const [categories, setCategories] = useState([]);
  // 使用状态来保存每个菜单项的数量
  const [quantities, setQuantities] = useState(
    {}
    // menuData.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
  //已选择的一级分类
  const [selectedCategory, setSelectedCategory] = useState(0);
  //已选择的二级分类
  const [selectedSubCategories, setSelectedSubCategories] = useState([0]);

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    console.log(quantities);
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  // // 切换一级分类
  // const handleCategoryChange = (index) => {
  //   setSelectedCategory(index);
  //   console.log("index===:", index);
  //   setSelectedSubCategories(categories[index].subcategories); // 默认选中所有二级分类
  // };

  // // 切换二级分类
  // const handleSubCategoryChange = (subCategory) => {
  //   if (
  //     selectedSubCategories.length === 1 &&
  //     selectedSubCategories.includes(subCategory)
  //   ) {
  //     // 如果是最后一个被选中的项，不取消
  //     return;
  //   }

  //   if (selectedSubCategories.includes(subCategory)) {
  //     // 如果已选中，取消选中
  //     setSelectedSubCategories((prev) =>
  //       prev.filter((item) => item !== subCategory)
  //     );
  //   } else {
  //     // 添加到选中列表
  //     setSelectedSubCategories((prev) => [...prev, subCategory]);
  //   }
  // };

  // 切换一级分类
  const handleCategoryChange = (index) => {
    setSelectedCategory(index);
    // 默认选中所有对应的二级分类
    setSelectedSubCategories([
      "All", // 添加 "All/全部"
      ...categories[index].subcategories.map((sub) => sub.id),
    ]);
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
    } else {
      // 如果点击的是其他二级筛选项
      setSelectedSubCategories([subCategoryId]); // 只选择当前项
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.itemName}>{item.itemNameEN}</Text>
          <Text style={styles.itemDescription}>{item.itemNameCN}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.actions}>
        {/* <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity> */}
        <View style={styles.quantity}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.quantityIcon}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantities[item.id]}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.quantityIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const fetchData = async () => {
    try {
      const menuitemsResult = await getMenuitems();
      if (menuitemsResult.status && menuitemsResult.data.rows) {
        setMenuData(menuitemsResult.data.rows);
        setQuantities(
          menuitemsResult.data.rows.reduce(
            (acc, item) => ({ ...acc, [item.id]: 0 }),
            {}
          )
        );
      }
      const categoriesResult = await getCategories();
      if (categoriesResult.status && categoriesResult.data) {
        console.log("categoriesResult=======", categoriesResult.data);
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
    <View>
      <NavigationBar />
      <View style={styles.container}>
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

        {/* 二级筛选 */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.filterRow}>
            {categories[selectedCategory] &&
              categories[selectedCategory]["subcategories"].map(
                (subCategory) => (
                  <TouchableOpacity
                    key={subCategory.id}
                    style={[
                      styles.filterButton,
                      selectedSubCategories.includes(subCategory) &&
                        styles.activeFilter,
                    ]}
                    onPress={() => handleSubCategoryChange(subCategory)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedSubCategories.includes(subCategory) &&
                          styles.activeFilterText,
                      ]}
                    >
                      {subCategory.name}
                    </Text>
                  </TouchableOpacity>
                )
              )}
          </View>
        </ScrollView> */}
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
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
    backgroundColor: "#4caf50",
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
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#2ecc71",
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: 40,
  },
});
