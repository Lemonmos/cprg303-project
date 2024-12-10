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
import { getMenuitems } from "../../utils/api";

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
const categories = {
  Appetizers: [
    "Spring Rolls",
    "Garlic Bread",
    "Salad",
    "Spring Rolls1",
    "Garlic Bread1",
    "Salad1",
    "Spring Rolls2",
    "Garlic Bread2",
    "Salad2",
  ],
  Mains: ["Steak", "Burger", "Pizza"],
  Drinks: ["Coke", "Juice", "Wine"],
  Desserts: ["Ice Cream", "Cake", "Cookies"],
  Desserts1: ["Ice Cream1", "Cake1", "Cookies1"],
  Desserts2: ["Ice Cream2", "Cake2", "Cookies2"],
  Desserts3: ["Ice Cream2", "Cake2", "Cookies2"],
};

export default function Broth() {
  const [brothData, setBrothData] = useState([]);
  // 使用状态来保存每个菜单项的数量
  const [quantities, setQuantities] = useState(
    {}
    // menuData.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const [selectedCategory, setSelectedCategory] = useState("Appetizers");
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    categories["Appetizers"]
  );

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  };

  // 切换一级分类
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategories(categories[category]); // 默认选中所有二级分类
  };

  // 切换二级分类
  const toggleSubCategory = (subCategory) => {
    if (
      selectedSubCategories.length === 1 &&
      selectedSubCategories.includes(subCategory)
    ) {
      // 如果是最后一个被选中的项，不取消
      return;
    }

    if (selectedSubCategories.includes(subCategory)) {
      // 如果已选中，取消选中
      setSelectedSubCategories((prev) =>
        prev.filter((item) => item !== subCategory)
      );
    } else {
      // 添加到选中列表
      setSelectedSubCategories((prev) => [...prev, subCategory]);
    }
  };

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
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
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
      const result = await getMenuitems();
      if (result.status && result.data.rows) {
        setBrothData(result.data.rows);
        setQuantities(
          result.data.rows.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
        );
      }
    } catch (error) {
      console.error("error in fetching tasks", error);
    }
  };

  useEffect(() => {
    console.log("State updated, brothData:", brothData);
  }, [brothData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* 一级筛选 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.filterRow}>
          {Object.keys(categories).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.activeFilter,
              ]}
              onPress={() => handleCategoryChange(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.activeFilterText,
                ]}
              >
                {category}
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
          {categories[selectedCategory].map((subCategory) => (
            <TouchableOpacity
              key={subCategory}
              style={[
                styles.filterButton,
                selectedSubCategories.includes(subCategory) &&
                  styles.activeFilter,
              ]}
              onPress={() => toggleSubCategory(subCategory)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSubCategories.includes(subCategory) &&
                    styles.activeFilterText,
                ]}
              >
                {subCategory}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <FlatList
        data={brothData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    marginVertical: 15, // 为上下增加外间距
    paddingVertical: 15, // 为上下增加内间距
    alignItems: "center", // 确保内容垂直居中
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 5, // 保持两侧内间距
    height: 50, // 设置行高，避免文字被裁剪
    alignItems: "center", // 垂直居中
  },
  filterButton: {
    paddingVertical: 5, // 增加上下内边距，确保文字不被裁剪
    paddingHorizontal: 10, // 左右间距保持
    backgroundColor: "#ddd",
    borderRadius: 15, // 圆角更柔和
    marginHorizontal: 8, // 增加按钮间距
    marginVertical: 5, // 增加按钮上下间距
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
