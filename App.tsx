import { useEffect } from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
} from "@expo-google-fonts/rubik";

import { CalcStore } from "./src/context/CalcContext";
import MainNavigation from "./src/navigations/MainNavigation";

export default function App() {
  let [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const storage = await AsyncStorage.getItem("device-id");
      if (!storage) {
        const uuid = uuidv4();

        await AsyncStorage.setItem("device-id", uuid);
      }

      if (fontsLoaded) {
        setLoaded(true);
      }
    })();
  }, [fontsLoaded]);

  if (loaded) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <CalcStore>
          <MainNavigation />
        </CalcStore>
      </NavigationContainer>
    );
  } else {
    return (
      <View style={{ position: "relative", flex: 1 }}>
        <Text
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            transform: [{ translateX: -70 }],
            textTransform: "uppercase",
            fontSize: 20,
          }}
        >
          Уншиж байна
        </Text>
      </View>
    );
  }
}
