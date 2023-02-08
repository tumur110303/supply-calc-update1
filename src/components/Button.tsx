import { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { gray, light, main, w400 } from "../constants";

type Props = {
  children?: string;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const Button: FC<Props> = ({
  children = "button",
  onPress,
  disable,
  style,
}) => {
  return (
    <TouchableOpacity
      style={
        disable ? [css.container, css.disable, style] : [css.container, style]
      }
      activeOpacity={disable ? 1 : 0.7}
      onPress={() => {
        if (!disable && onPress) {
          onPress();
        }
      }}
    >
      <Text style={css.text}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const css = StyleSheet.create({
  container: {
    backgroundColor: main,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  text: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: w400,
    color: light,
    fontSize: 13,
  },
  disable: {
    backgroundColor: gray,
  },
});
