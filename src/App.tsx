import { StatusBar } from "expo-status-bar";
import { ReactText, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  Pressable,
  Linking,
} from "react-native";
import * as Contacts from "expo-contacts";
import { DeviceEventEmitter } from "react-native";
import QuickActions from "react-native-quick-actions";

import FakeyText from "./components/FakeyText";
import { getContacts } from "./utilities/getContacts";
import Thumbnail from "./components/Thumbnail";

const colors = ["pink", "blue", "violet"];

const renderItem: ListRenderItem<Contacts.Contact> = ({ item }) => (
  <Pressable style={styles.contact}>
    <Thumbnail
      name={item.name}
      style={{ backgroundColor: colors[Math.floor(Math.random() * 3)] }}
    />

    <View style={{ marginLeft: 16 }}>
      <FakeyText text={item.name} />
      <FakeyText
        text={item.phoneNumbers?.[0]?.number!}
        style={{ fontSize: 12, marginTop: 8 }}
      />
    </View>
  </Pressable>
);

export default function App() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshContacts = async () => {
    setIsLoading(true);
    const contacts = await getContacts();
    setContacts(contacts!);
    setIsLoading(false);
  };

  useEffect(() => {
    getContacts().then((contacts) => {
      setContacts(contacts!);
      setIsLoading(false);

      QuickActions.setShortcutItems(
        contacts?.map((contact) => ({
          type: "contact",
          title: contact.name,
          icon: "splashscreen_image",
          userInfo: { url: contact.phoneNumbers?.[0].number! },
        }))!
      );
    });

    const listener = DeviceEventEmitter.addListener(
      "quickActionShortcut",
      (data) => Linking.openURL(`tel:${data.userInfo.url}`)
    );

    QuickActions.popInitialAction()
      .then((data) => Linking.openURL(`tel:${data.userInfo.url}`))
      .catch(console.error);

    return () => listener.remove();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <FlatList
        data={contacts}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.container}>
            {isLoading ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <>
                <FakeyText text={"No Contact"} bold />
                <FakeyText
                  text={"Pull down to refresh"}
                  style={{ color: "grey" }}
                />
              </>
            )}
          </View>
        }
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(item) => item.id}
        onRefresh={refreshContacts}
        refreshing={isLoading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contact: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 16,
    borderBottomColor: "lightgrey",
    alignItems: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    marginTop: 16,
  },
});
