import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Task from "../utils/task";

const Register = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register Screen</Text>
      <Text style={styles.text}>Register Screen</Text>
      <Text style={styles.text}>Register Screen</Text>
      <Task />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
    height: "50%",
  },
  text: {
    color: "white",
    fontSize: 25,
  },
});
