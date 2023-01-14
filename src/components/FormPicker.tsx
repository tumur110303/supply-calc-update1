import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { dark, darker, gray, light, main, w400 } from "../constants";

const { width, height } = Dimensions.get("window");

type Props = {
  icon?: string;
  label?: string;
  options: { label: string; value: string | number }[];
  value: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

const FormPicker: FC<Props> = ({
  icon,
  label,
  options,
  value,
  onValueChange,
  style,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <TouchableOpacity
      style={[css.container, style]}
      activeOpacity={0.9}
      onPress={() => setShowModal(true)}
    >
      {label && <Text style={css.title}>{label}</Text>}
      <View style={css.wrapper}>
        {icon && (
          <MaterialCommunityIcons name={icon as any} size={24} color={main} />
        )}
        <Text style={css.selected}>
          {(() => {
            const selected = options.find(
              (option) => option.value + "" === value + ""
            );
            if (selected) {
              return selected.label;
            } else {
              return options[0].label;
            }
          })()}
        </Text>
        <Modal transparent visible={showModal} animationType="slide">
          <View style={css.modal_container}>
            <TouchableOpacity
              style={css.modal_overlay}
              activeOpacity={0.7}
              onPress={() => setShowModal(false)}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: dark,
                  opacity: 0.3,
                }}
              ></View>
            </TouchableOpacity>
            <ScrollView style={css.modal_wrapper}>
              <View style={{ marginTop: 5 }}></View>
              {options.map((option, i) => (
                <TouchableOpacity
                  style={css.modal_item}
                  activeOpacity={0.7}
                  key={i}
                  onPress={() => {
                    setShowModal(false);
                    if (onValueChange) {
                      onValueChange(option.value + "");
                    }
                  }}
                >
                  <Text style={css.modal_text}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <View style={{ marginTop: 5 }}></View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

export default FormPicker;

const css = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    textTransform: "uppercase",
    fontFamily: w400,
    marginBottom: 5,
    color: darker,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: light,
    height: 37,
    paddingBottom: 2,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  selected: {
    color: gray,
    fontFamily: w400,
    marginLeft: 5,
  },

  modal_container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  modal_wrapper: {
    position: "absolute",
    backgroundColor: "#f6f6f6",
    width: width / 1.15,
    maxHeight: height / 1.3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 10,
    paddingHorizontal: 10,
  },
  modal_overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal_item: {
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 5,
    borderRadius: 5,
    paddingVertical: 10,
  },
  modal_text: {
    textAlign: "center",
    padding: 2,
  },
});
