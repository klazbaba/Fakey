import { ComponentProps, ReactText } from "react";
import { StyleSheet, Text } from "react-native";

interface Props extends ComponentProps<typeof Text> {
  text: ReactText;
  bold?: boolean;
}

export default function FakeyText(props: Props) {
  return (
    <Text
      {...props}
      style={[
        styles.text,
        props.style,
        props.bold ? { fontWeight: "bold" } : undefined,
      ]}
    >
      {props.text}
    </Text>
  );
}

const styles = StyleSheet.create({ text: { fontSize: 16 } });
