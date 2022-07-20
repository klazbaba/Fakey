import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  Pressable,
  Linking,
  Alert,
  Platform,
} from "react-native";
import * as Contacts from "expo-contacts";
import { DeviceEventEmitter } from "react-native";
import QuickActions from "react-native-quick-actions";
import notifee, {
  AndroidCategory,
  AndroidColor,
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

import FakeyText from "./components/FakeyText";
import { getContacts } from "./utilities/getContacts";
import Thumbnail from "./components/Thumbnail";

const colors = ["pink", "blue", "violet"];
const image = require("./assets/minions.jpeg");

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

const setNotificationCategory = async () => {
  await notifee.setNotificationCategories([
    {
      id: "faker",
      actions: [
        {
          id: "reject",
          title: "Reject",
        },
        {
          id: "accept",
          title: "Accept",
        },
      ],
    },
  ]);
};

const displayNotification = async () => {
  await notifee.requestPermission({ criticalAlert: true });
  const channelId = await notifee.createChannel({
    id: "default2",
    name: "Fakey Notification Channel",
    bypassDnd: true,
    description: "You have an incoming call",
    importance: AndroidImportance.HIGH,
    lightColor: AndroidColor.WHITE,
    sound: "ringtone",
    visibility: AndroidVisibility.PUBLIC,
    lights: true,
  });

  await notifee.displayNotification({
    title: "Incoming Call",
    body: "John",
    android: {
      channelId,
      fullScreenAction: {
        id: "default",
        mainComponent: "incomingCallScreen",
        launchActivity: "default",
      },
      category: AndroidCategory.CALL,
      actions: [
        {
          title: "Reject",
          pressAction: { id: "reject", mainComponent: "main" },
        },
        {
          title: "Accept",
          pressAction: { id: "accept", mainComponent: "main" },
        },
      ],
      sound: "ringtone", // For Android < 8.0
      importance: AndroidImportance.HIGH, // For Android < 8.0
      autoCancel: false,
      style: {
        type: AndroidStyle.BIGPICTURE,
        picture: image,
      },
      largeIcon: image,
    },
    ios: {
      foregroundPresentationOptions: {
        sound: true,
      },
      sound: "ringtone.wav",
      // A special request is required from Apple for critical notifications to work https://developer.apple.com/documentation/usernotifications/unauthorizationoptions/2963120-criticalalert
      critical: true,
      criticalVolume: 1.0,
      categoryId: "faker",
      attachments: [{ url: image }],
    },
  });
};

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
    getContacts().then(async (contacts) => {
      setContacts(contacts!);
      setIsLoading(false);

      if (Platform.OS === "android")
        await messaging().registerDeviceForRemoteMessages();
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
        Alert.alert(`Call was ${detail.pressAction?.id}ed`);
      }
    });

    notifee.onBackgroundEvent(async (event) => {
      // console.log(JSON.stringify(event, null, 2));
    });

    const listener = DeviceEventEmitter.addListener(
      "quickActionShortcut",
      (data) => Linking.openURL(`tel:${data.userInfo.url}`)
    );

    QuickActions.popInitialAction()
      .then((data) => {
        if (data) Linking.openURL(`tel:${data.userInfo.url}`);
      })
      .catch(console.error);

    setNotificationCategory();

    if (Platform.OS === "android") {
      messaging().onMessage(displayNotification);
      messaging().setBackgroundMessageHandler(displayNotification);
    }

    if (Platform.OS === "ios") setTimeout(() => displayNotification(), 5000);

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
        refreshing={isLoading && !!contacts?.length}
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
