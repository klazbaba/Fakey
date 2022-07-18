import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  View,
} from "react-native";
import * as Contacts from "expo-contacts";

export default function App() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Contacts.requestPermissionsAsync().then(async ({ status }) => {
      if (status !== "granted")
        Alert.alert(
          "Permission to access contacts is required in order to continue.",
          "",
          [
            { text: "Cancel" },
            {
              onPress: () => Linking.openSettings(),
              text: "Grant Permission",
            },
          ]
        );
      else if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        setContacts(data);
        setIsLoading(false);
        console.log(JSON.stringify(data, null, 2));
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} animating={isLoading} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
