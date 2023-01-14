import { FC } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { dark, gray, light, main, w400 } from "../../constants";
import FormPicker from "../FormPicker";

type Props = {
  label?: string;
  placeholder?: string | [string, string];
  keyboardType?:
    | KeyboardTypeOptions
    | [KeyboardTypeOptions, KeyboardTypeOptions];
  value: string | [string, string, number];
  check?: boolean;
  onChangeText?: (value: string) => void;
  checkChangeText?: (value: string) => void;
  checkChangeValue?: (value: string) => void;
  icon?: string | [string, string];
  error?: {
    text: string;
    show?: boolean;
  };
  secure?: boolean;
  style?: StyleProp<ViewStyle>;
  cables: { label: string; value: number | string }[];
};

const Textfield: FC<Props> = ({
  label,
  placeholder = "placeholder",
  keyboardType = "default",
  value,
  check,
  onChangeText,
  checkChangeText,
  checkChangeValue,
  icon,
  secure,
  error,
  style,
  cables,
}) => {
  return (
    <View style={[css.container, style]}>
      {label && <Text style={css.title}>{label}</Text>}
      <View style={css.wrapper}>
        <TextInput
          editable={true}
          placeholder={
            typeof placeholder === "object" ? placeholder[0] : placeholder
          }
          onChangeText={
            typeof onChangeText === "object" ? onChangeText[0] : onChangeText
          }
          secureTextEntry={secure}
          value={typeof value === "object" ? value[0] : value}
          keyboardType={
            typeof keyboardType === "object" ? keyboardType[0] : keyboardType
          }
          style={{
            ...css.input,
            paddingLeft: icon ? 35 : 10,
            paddingRight: check ? 10 : 30,
            marginRight: check ? 3 : 0,
          }}
          placeholderTextColor={gray}
        />

        <TextInput
          editable={true}
          placeholder={
            typeof placeholder === "object" ? placeholder[1] : placeholder
          }
          onChangeText={
            typeof checkChangeText === "object"
              ? checkChangeText[1]
              : checkChangeText
          }
          secureTextEntry={secure}
          value={typeof value === "object" ? value[1] : value}
          keyboardType={
            typeof keyboardType === "object" ? keyboardType[1] : keyboardType
          }
          style={{
            ...css.input,
            paddingLeft: icon ? 35 : 10,
            paddingRight: check ? 10 : 30,
            marginRight: check ? 3 : 0,
          }}
          placeholderTextColor={gray}
        />

        <FormPicker
          icon="cable-data"
          options={cables}
          onValueChange={checkChangeValue}
          value={typeof value === "object" ? value[2] + "" : value + ""}
          style={{ flex: 3 }}
        />
      </View>
      {error && error.show && (
        <Animatable.Text
          animation="fadeInLeft"
          duration={500}
          style={css.error}
        >
          {error.text}
        </Animatable.Text>
      )}
    </View>
  );
};

export default Textfield;

const css = StyleSheet.create({
  container: {},
  title: {
    textTransform: "uppercase",
    fontFamily: w400,
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 3,
    color: dark,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    position: "relative",
  },
  icon: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    left: 5,
    transform: [{ translateY: -12 }],
  },
  checkIcon: {
    position: "absolute",
    zIndex: 2,
    top: "50%",
    right: 5,
    transform: [{ translateY: -11 }],
  },
  input: {
    backgroundColor: light,
    color: dark,
    fontFamily: w400,
    paddingTop: 5,
    paddingBottom: 4,
    borderRadius: 5,
    flex: 1,
  },
  error: {
    color: "#DE4839",
    fontFamily: w400,
  },
});
