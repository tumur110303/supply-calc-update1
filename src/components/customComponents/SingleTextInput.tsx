import { FC } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  Text,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import { dark, gray, light, main, red, w400 } from "../../constants";

type Props = {
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;

  value?: string;
  disabled?: boolean;
  onChangeText?: (value: string) => void;
  error?: {
    text: string;
    show?: boolean;
  };
  secure?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SingleTextInput: FC<Props> = ({
  label,
  placeholder = "",
  keyboardType = "default",
  value,
  disabled,
  onChangeText,
  secure,
  error,
  style,
}) => {
  return (
    <View style={[css.container, style]}>
      {label && <Text style={css.title}>{label}</Text>}
      <View style={css.wrapper}>
        <TextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          value={typeof value === "object" ? value[0] : value}
          keyboardType={
            typeof keyboardType === "object" ? keyboardType[0] : keyboardType
          }
          editable={!disabled}
          placeholderTextColor={gray}
          style={css.input}
        />

        {error && error.show && (
          <Animatable.View animation="pulse" duration={500}>
            <MaterialCommunityIcons
              name="alert-remove-outline"
              size={22}
              color={red}
              style={css.checkIcon}
            />
          </Animatable.View>
        )}
        {error && !error.show && (
          <Animatable.View animation="pulse" duration={500}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={21}
              color={main}
              style={css.checkIcon}
            />
          </Animatable.View>
        )}
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

export default SingleTextInput;

const css = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  title: {
    // textTransform: "uppercase",
    fontFamily: w400,
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 3,
    color: dark,
  },
  wrapper: {
    flexDirection: "row",
    position: "relative",
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
    paddingTop: Platform.OS === "android" ? 5 : 10,
    paddingBottom: Platform.OS === "android" ? 4 : 9,
    borderRadius: 5,
    marginLeft: 3,
  },
  error: {
    color: "#DE4839",
    fontFamily: w400,
  },
});
