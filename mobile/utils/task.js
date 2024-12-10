import {
  View,
  Text,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getTasks, createPost } from "./api";

const Task = () => {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", title: "" });
  const fetchData = async () => {
    try {
      const result = await getTasks();
      console.log("result", result);
      setData(result);
    } catch (error) {
      console.error("error in fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createData = async (text) => {
    try {
      if (newTask.name && newTask.title) {
        const createdTask = await createPost(newTask);
        setData([createdTask, ...data]);
        setNewTask({ name: "", title: "" });
      } else {
        alert("Please enter name and title");
      }
    } catch (error) {
      console.error("error in fetching tasks", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <Text>Todo Task</Text>
      <View style={styles.view}>
        <TextInput
          style={styles.input}
          placeholder="enter name"
          value={newTask.name}
          onChangeText={(text) => setNewTask({ ...newTask, name: text })}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="enter title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        ></TextInput>
        <TouchableOpacity style={styles.addbutton} onPress={createData}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, color: "white" }}>
        <Text>Total number:{data.length}</Text>
        {data.length > 0 ? (
          data.map((task) => (
            <View key={task.id}>
              <Text>Id:{task.id}</Text>
              <Text>Name:{task.name}</Text>
              <Text>Title:{task.title}</Text>
            </View>
          ))
        ) : (
          <View>
            <Text>Loading data</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  view: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "yellow",
  },
  addbutton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent for modern effect
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    color: "#333",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },

  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
    textAlign: "center",
    marginTop: 10,
  },
});
