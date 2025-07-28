import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user?.uid === undefined) return;
    if (!user?.uid) router.replace("/");
  }, [user]);

  if (user?.uid === null || user?.uid === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "fixed" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Feedback"
        options={{
          title: "Novo Feedback",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.and.pencil" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Logout"
        options={{
          title: "Sair",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="rectangle.portrait.and.arrow.right"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
