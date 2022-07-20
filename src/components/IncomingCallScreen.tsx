import { Pressable, StyleSheet, View } from "react-native";
import FakeyText from "./FakeyText";

export default function IncomingCallScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsWrapper}>
        <Pressable style={[styles.button, { backgroundColor: "red" }]}>
          <FakeyText text={"Reject"} style={{ color: "white" }} />
        </Pressable>

        <Pressable style={styles.button}>
          <FakeyText text={"Accept"} style={{ color: "white" }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  button: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginBottom: "40%",
  },
});
