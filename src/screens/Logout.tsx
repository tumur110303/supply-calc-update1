import { FC, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import axios from "../axios";
import { main } from "../constants";
import UserContext from "../context/UserContext";

const Logout: FC = () => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      await axios.post("/logout");
      userContext?.setStatus(false);
    })();
  }, []);
  return (
    <View style={css.container}>
      <ActivityIndicator style={css.indicator} size="large" color={main} />
    </View>
  );
};

export default Logout;

const css = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    transform: [{ scale: 1.5 }],
  },
});
