import { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { darker, green, light, red, w400 } from "../../constants";

type Props = {
  onPress: (value: boolean) => void;
  onValue: boolean;
  style?: StyleProp<ViewStyle>;
};

const Switch: FC<Props> = ({ style, onValue, onPress }) => {
  return (
    <View style={{ width: 48, marginHorizontal: 5 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          width: "100%",
          height: 30,
          backgroundColor: onValue ? green : red,
          borderRadius: 15,
          flexWrap: "wrap",
        }}
        onPress={() => onPress(!onValue)}
      >
        <Animatable.View animation="pulse" duration={500}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: onValue ? 0 : 19,
              backgroundColor: light,
              width: 25,
              height: 25,
              margin: 2,
              borderRadius: 12.5,
            }}
          ></View>
        </Animatable.View>
      </TouchableOpacity>
    </View>
  );
};

export default Switch;

const css = StyleSheet.create({
  // Агуулж буй view хэлбэржүүлэлт...
  title: {
    fontFamily: w400,
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 3,
    color: darker,
  },
  //   Switch-ийн хэлбэржүүлэлт...
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    width: 20,
    height: 37,
    backgroundColor: darker,
    paddingVertical: 3,
    paddingRight: 5,
    borderRadius: 5,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
