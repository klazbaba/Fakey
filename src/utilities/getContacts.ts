import * as Contacts from "expo-contacts";
import { Alert, Linking } from "react-native";

export const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
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
    return data;
  }
};
