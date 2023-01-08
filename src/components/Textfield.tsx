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

import { dark, gray, light, main, w400 } from "../constants";

type Props = {
  label?: string;
  placeholder?: string | [string, string];
  keyboardType?:
    | KeyboardTypeOptions
    | [KeyboardTypeOptions, KeyboardTypeOptions];
  value?: string | [string, string];
  check?: boolean;
  disabled?: boolean;
  onChangeText?: (value: string) => void;
  checkChangeText?: (value: string) => void;
  icon?: string | [string, string];
  error?: {
    text: string;
    show?: boolean;
  };
  secure?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Textfield: FC<Props> = ({
  label,
  placeholder = "",
  keyboardType = "default",
  value,
  check,
  disabled,
  onChangeText,
  checkChangeText,
  icon,
  secure,
  error,
  style,
}) => {
  return (
    <View style={[css.container, style]}>
      {label && <Text style={css.title}>{label}</Text>}
      <View style={css.wrapper}>
        {icon && typeof icon === "object" ? (
          <MaterialCommunityIcons
            name={icon[0] as any}
            size={24}
            color={main}
            style={css.icon}
          />
        ) : (
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={main}
            style={css.icon}
          />
        )}
        <TextInput
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
            opacity: disabled ? 0.4 : 1,
          }}
          editable={!disabled}
          placeholderTextColor={gray}
        />
        {check && (
          <>
            {icon && typeof icon === "object" ? (
              <MaterialCommunityIcons
                name={icon[1] as any}
                size={24}
                color={main}
                style={{
                  ...css.icon,
                  left: "50%",
                  transform: [{ translateY: -12 }],
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name={icon as any}
                size={24}
                color={main}
                style={{
                  ...css.icon,
                  left: "50%",
                  transform: [{ translateY: -12 }],
                }}
              />
            )}
          </>
        )}
        {check && (
          <TextInput
            placeholder={
              typeof placeholder === "object" ? placeholder[1] : placeholder
            }
            onChangeText={checkChangeText}
            value={typeof value === "object" ? value[1] : value}
            keyboardType={
              typeof keyboardType === "object" ? keyboardType[1] : keyboardType
            }
            secureTextEntry={secure}
            style={{
              ...css.input,
              paddingLeft: 30,
              paddingRight: 30,
              marginLeft: 3,
            }}
            placeholderTextColor={gray}
          />
        )}
        {error && error.show && (
          <Animatable.View animation="pulse" duration={500}>
            <MaterialCommunityIcons
              name="alert-remove-outline"
              size={22}
              color="#DE4839"
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
    paddingTop: Platform.OS === "android" ? 5 : 10,
    paddingBottom: Platform.OS === "android" ? 4 : 9,
    borderRadius: 5,
    flex: 1,
  },
  error: {
    color: "#DE4839",
    fontFamily: w400,
  },
});
