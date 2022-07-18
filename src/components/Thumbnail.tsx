import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import FakeyText from "./FakeyText";

interface Props extends ComponentProps<typeof View> {
  name: string;
}

export default function Thumbnail(props: Props) {
  return (
    <View {...props} style={[styles.wrapper, props.style]}>
      <FakeyText bold text={props.name[0].toUpperCase()} style={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
});
