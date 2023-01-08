import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal as RnModal,
  Text,
  TouchableOpacity,
} from "react-native";
import { dark, main, w500 } from "../constants";

type Props = {
  title?: string;
  visible?: boolean;
  setVisible?: (state: boolean) => void;
};

const Modal: FC<Props> = ({
  title,
  children,
  visible,
  setVisible = () => {},
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
      <View style={css.container}>
        <TouchableOpacity
          style={css.overlay}
          activeOpacity={0.35}
          onPress={() => {
            setVisible(false);
          }}
        ></TouchableOpacity>
        <View style={css.wrapper}>
          {title && <Text style={css.title}>{title}</Text>}
          {children}
        </View>
      </View>
    </RnModal>
  );
};

export default Modal;

const css = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
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
    width: "80%",

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
