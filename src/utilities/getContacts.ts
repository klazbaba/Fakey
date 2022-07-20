import * as Contacts from "expo-contacts";
import { Alert, Linking } from "react-native";
import QuickActions from "react-native-quick-actions";

export const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
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
    return [];
  } else if (status === "granted") {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    QuickActions.setShortcutItems(
      data?.map((contact) => ({
        type: "contact",
        title: contact.name,
        icon: "splashscreen_image",
        userInfo: { url: contact.phoneNumbers?.[0].number! },
      }))!
    );
    return data;
  }
};
