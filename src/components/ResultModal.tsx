import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal as RnModal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { dark, main, w500 } from "../constants";
import Button from "./Button";

type Props = {
  title?: string;
  visible?: boolean;
  setVisible?: (state: boolean) => void;
  reset?: () => void;
};

const ResultModal: FC<Props> = ({
  children,
  title = "Гарчиг",
  visible,
  setVisible = () => {},
  reset,
}) => {
  return (
    <RnModal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <TouchableOpacity
        style={css.overlay}
        activeOpacity={0.35}
        onPress={() => {
          setVisible(false);
        }}
      ></TouchableOpacity>
      <ScrollView style={css.wrapper}>
        <Text style={css.title}>{title}</Text>
        {children}
        <Button onPress={() => setVisible(false)}>Хаах</Button>
        <Button onPress={reset}>Эхлэх</Button>
        <View style={{ marginBottom: 40 }}></View>
      </ScrollView>
    </RnModal>
  );
};

export default ResultModal;

const css = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: dark,
    opacity: 0.4,
  },
  title: {
    fontFamily: w500,
    textTransform: "uppercase",
    fontSize: 20,
    color: main,
    textAlign: "center",
  },
  wrapper: {
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    marginVertical: 30,
    marginHorizontal: 20,

    paddingVertical: 20,
    paddingHorizontal: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
